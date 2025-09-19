import * as vscode from 'vscode';
import { ConfigurationService } from './configurationService';
import { ASRManager } from '../core/asrManager';
import { AudioRecorder } from '../core/audioRecorder';

export type TranscriptionState = 'idle' | 'recording' | 'transcribing' | 'disabled' | 'loading' | 'error' | 'uninitialized' | 'initializing';

export class TranscriptionService implements vscode.Disposable {
    private readonly _onStateChange = new vscode.EventEmitter<TranscriptionState>();
    public readonly onStateChange = this._onStateChange.event;

    private asrManager: ASRManager;
    private audioRecorder: AudioRecorder;
    private currentState: TranscriptionState = 'idle';
    private disposables: vscode.Disposable[] = [];

    constructor(
        private readonly context: vscode.ExtensionContext,
        private configService: ConfigurationService
    ) {
        // Context used for extension lifecycle management
        void this.context; // Suppress unused parameter warning
        this.asrManager = new ASRManager(context);
        this.audioRecorder = new AudioRecorder();

        // Listen to ASR state changes
        this.asrManager.onStateChange((state) => {
            this.updateState(this.mapASRStateToTranscriptionState(state));
        });

        // Listen to transcription results
        this.asrManager.onTranscriptionResult((result) => {
            this.handleTranscriptionResult(result);
        });

        // Listen to configuration changes
        this.disposables.push(
            this.configService.onConfigurationChanged(() => {
                // Refresh ASR configuration if needed
                this.asrManager.updateConfiguration({
                    language: this.configService.getLanguage(),
                    maxTokens: this.configService.getMaxTokens()
                });
            })
        );
    }

    async initialize(): Promise<void> {
        try {
            this.updateState('loading');
            await this.asrManager.initialize();
            this.updateState('idle');
        } catch (error) {
            console.error('Failed to initialize ASR:', error);
            this.updateState('error');
            throw error;
        }
    }

    async toggleRecording(): Promise<void> {
        if (this.currentState === 'recording') {
            await this.stopRecording();
        } else if (this.currentState === 'idle') {
            await this.startRecording();
        } else {
            vscode.window.showWarningMessage(`Cannot toggle recording in current state: ${this.currentState}`);
        }
    }

    async startRecording(): Promise<void> {
        try {
            if (this.currentState !== 'idle') {
                throw new Error(`Cannot start recording in state: ${this.currentState}`);
            }

            this.updateState('recording');
            await this.audioRecorder.startRecording();
        } catch (error) {
            console.error('Failed to start recording:', error);
            this.updateState('idle');
            
            if (error instanceof Error) {
                if (error.name === 'NotAllowedError') {
                    vscode.window.showErrorMessage('Microphone access denied. Please allow microphone access in your browser/system settings.');
                } else if (error.name === 'NotFoundError') {
                    vscode.window.showErrorMessage('No microphone found. Please connect a microphone and try again.');
                } else {
                    vscode.window.showErrorMessage(`Failed to start recording: ${error.message}`);
                }
            }
            throw error;
        }
    }

    async stopRecording(): Promise<void> {
        try {
            if (this.currentState !== 'recording') {
                return;
            }

            this.updateState('transcribing');
            const audioData = await this.audioRecorder.stopRecording();
            
            if (audioData && audioData.length > 0) {
                const language = this.configService.getLanguage();
                await this.asrManager.transcribe(audioData, language);
            } else {
                this.updateState('idle');
                vscode.window.showWarningMessage('No audio data recorded.');
            }
        } catch (error) {
            console.error('Failed to stop recording:', error);
            this.updateState('idle');
            vscode.window.showErrorMessage(`Failed to process recording: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    private updateState(newState: TranscriptionState): void {
        if (this.currentState !== newState) {
            this.currentState = newState;
            this._onStateChange.fire(newState);
        }
    }

    private async handleTranscriptionResult(result: { text: string; isComplete: boolean }): Promise<void> {
        if (result.isComplete) {
            this.updateState('idle');
            
            if (result.text.trim()) {
                if (this.configService.getAutoInsertInEditor()) {
                    await this.insertTextInEditor(result.text);
                } else {
                    // Show the result and let user decide
                    const action = await vscode.window.showInformationMessage(
                        `Transcription: "${result.text}"`,
                        'Insert in Editor',
                        'Copy to Clipboard'
                    );
                    
                    if (action === 'Insert in Editor') {
                        await this.insertTextInEditor(result.text);
                    } else if (action === 'Copy to Clipboard') {
                        await vscode.env.clipboard.writeText(result.text);
                    }
                }
            } else {
                vscode.window.showWarningMessage('No speech detected in recording.');
            }
        }
    }

    private async insertTextInEditor(text: string): Promise<void> {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const position = editor.selection.active;
            await editor.edit(editBuilder => {
                editBuilder.insert(position, text);
            });
        } else {
            // No active editor, copy to clipboard instead
            await vscode.env.clipboard.writeText(text);
            vscode.window.showInformationMessage('No active editor. Text copied to clipboard.');
        }
    }

    private mapASRStateToTranscriptionState(asrState: import('../core/asrManager').ASRState): TranscriptionState {
        switch (asrState) {
            case 'uninitialized':
                return 'uninitialized';
            case 'initializing':
                return 'initializing';
            case 'loading':
                return 'loading';
            case 'ready':
                return 'idle';
            case 'transcribing':
                return 'transcribing';
            case 'error':
                return 'error';
            default:
                return 'idle';
        }
    }

    dispose(): void {
        this._onStateChange.dispose();
        this.asrManager.dispose();
        this.audioRecorder.dispose();
        this.disposables.forEach(d => d.dispose());
    }
}
