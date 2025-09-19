import * as vscode from 'vscode';

let statusBarItem: vscode.StatusBarItem;
let isRecording = false;
let mediaRecorder: MediaRecorder | null = null;
let audioChunks: Blob[] = [];
let whisperPipeline: any = null;

// Initialize Whisper model
async function initializeWhisper() {
    try {
        const { pipeline } = await import('@xenova/transformers');
        whisperPipeline = await pipeline('automatic-speech-recognition', 'Xenova/whisper-tiny.en');
        console.log('Whisper model loaded successfully');
        return true;
    } catch (error) {
        console.warn('Failed to load Whisper model:', error);
        return false;
    }
}

// Transcribe audio using Whisper
async function transcribeWithWhisper(audioBlob: Blob): Promise<string> {
    try {
        if (!whisperPipeline) {
            throw new Error('Whisper pipeline not initialized');
        }

        // Convert blob to array buffer
        const arrayBuffer = await audioBlob.arrayBuffer();
        const audioContext = new AudioContext();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        
        // Convert to Float32Array (required by Whisper)
        const audioData = audioBuffer.getChannelData(0);
        
        // Transcribe using Whisper
        const result = await whisperPipeline(audioData);
        return result.text || '';
    } catch (error) {
        console.error('Whisper transcription failed:', error);
        throw error;
    }
}

// Transcribe audio using Web Speech API
function transcribeWithWebSpeech(): Promise<string> {
    return new Promise((resolve, reject) => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        
        if (!SpeechRecognition) {
            reject(new Error('Web Speech API not supported'));
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            resolve(transcript);
        };

        recognition.onerror = (event: any) => {
            reject(new Error(`Speech recognition error: ${event.error}`));
        };

        recognition.onend = () => {
            if (isRecording) {
                stopRecording();
            }
        };

        recognition.start();
    });
}

// Start recording audio
async function startRecording(): Promise<void> {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        audioChunks = [];
        mediaRecorder = new MediaRecorder(stream);
        
        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                audioChunks.push(event.data);
            }
        };

        mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            
            // Stop all tracks to release microphone
            stream.getTracks().forEach(track => track.stop());
            
            // Try Whisper first, fallback to Web Speech API
            let transcript = '';
            try {
                if (whisperPipeline) {
                    updateStatusBar('Transcribing with Whisper...');
                    transcript = await transcribeWithWhisper(audioBlob);
                } else {
                    throw new Error('Whisper not available');
                }
            } catch (error) {
                console.warn('Whisper transcription failed, trying Web Speech API:', error);
                try {
                    updateStatusBar('Transcribing with Web Speech API...');
                    transcript = await transcribeWithWebSpeech();
                } catch (speechError) {
                    vscode.window.showErrorMessage(`Transcription failed: ${speechError}`);
                    updateStatusBar('Ready');
                    return;
                }
            }
            
            // Insert transcribed text into editor
            if (transcript.trim()) {
                insertTextAtCursor(transcript.trim());
                vscode.window.showInformationMessage(`Transcribed: "${transcript.trim()}"`);
            } else {
                vscode.window.showWarningMessage('No speech detected');
            }
            
            updateStatusBar('Ready');
        };

        mediaRecorder.start();
        isRecording = true;
        updateStatusBar('Recording... (Click to stop)');
        
    } catch (error) {
        vscode.window.showErrorMessage(`Failed to start recording: ${error}`);
        updateStatusBar('Ready');
    }
}

// Stop recording audio
function stopRecording(): void {
    if (mediaRecorder && isRecording) {
        mediaRecorder.stop();
        isRecording = false;
    }
}

// Insert text at cursor position
function insertTextAtCursor(text: string): void {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
        const position = editor.selection.active;
        editor.edit(editBuilder => {
            editBuilder.insert(position, text);
        });
        
        // Move cursor to end of inserted text
        const newPosition = position.translate(0, text.length);
        editor.selection = new vscode.Selection(newPosition, newPosition);
    }
}

// Update status bar
function updateStatusBar(text: string): void {
    statusBarItem.text = `$(mic) ${text}`;
    statusBarItem.tooltip = isRecording ? 'Click to stop recording' : 'Click to start voice prompt';
}

// Handle status bar click
function handleStatusBarClick(): void {
    if (isRecording) {
        stopRecording();
    } else {
        vscode.commands.executeCommand('speechToText.startVoicePrompt');
    }
}

// Main command handler
async function startVoicePrompt(): Promise<void> {
    if (isRecording) {
        stopRecording();
        return;
    }

    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active editor found');
        return;
    }

    // Check microphone permission
    try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (error) {
        vscode.window.showErrorMessage('Microphone access denied. Please grant microphone permissions.');
        return;
    }

    await startRecording();
}

// Extension activation
export function activate(context: vscode.ExtensionContext) {
    console.log('Speech to Text extension is now active');

    // Initialize Whisper model in background
    initializeWhisper().catch(console.warn);

    // Create status bar item (more prominent)
    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 1000);
    statusBarItem.command = 'speechToText.statusBarClick';
    statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.prominentBackground');
    updateStatusBar('Ready');
    statusBarItem.show();

    // Register commands
    const startVoicePromptCommand = vscode.commands.registerCommand('speechToText.startVoicePrompt', startVoicePrompt);
    const statusBarClickCommand = vscode.commands.registerCommand('speechToText.statusBarClick', handleStatusBarClick);

    // Add to subscriptions
    context.subscriptions.push(
        startVoicePromptCommand,
        statusBarClickCommand,
        statusBarItem
    );

    // Show welcome message with better instructions
    vscode.window.showInformationMessage(
        '🎤 Speech to Text activated! Use the mic button in editor toolbar, Ctrl+Shift+V, or status bar.',
        'Try It Now',
        'Open Settings'
    ).then(selection => {
        if (selection === 'Try It Now') {
            vscode.commands.executeCommand('speechToText.startVoicePrompt');
        } else if (selection === 'Open Settings') {
            vscode.commands.executeCommand('workbench.action.openSettings', 'speechToText');
        }
    });
}

// Extension deactivation
export function deactivate() {
    if (isRecording) {
        stopRecording();
    }
    statusBarItem?.dispose();
}
