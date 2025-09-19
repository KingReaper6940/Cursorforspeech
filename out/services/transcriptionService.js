"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TranscriptionService = void 0;
const vscode = __importStar(require("vscode"));
const asrManager_1 = require("../core/asrManager");
const audioRecorder_1 = require("../core/audioRecorder");
class TranscriptionService {
    constructor(context, configService) {
        this.context = context;
        this.configService = configService;
        this._onStateChange = new vscode.EventEmitter();
        this.onStateChange = this._onStateChange.event;
        this.currentState = 'idle';
        this.disposables = [];
        // Context used for extension lifecycle management
        void this.context; // Suppress unused parameter warning
        this.asrManager = new asrManager_1.ASRManager(context);
        this.audioRecorder = new audioRecorder_1.AudioRecorder();
        // Listen to ASR state changes
        this.asrManager.onStateChange((state) => {
            this.updateState(this.mapASRStateToTranscriptionState(state));
        });
        // Listen to transcription results
        this.asrManager.onTranscriptionResult((result) => {
            this.handleTranscriptionResult(result);
        });
        // Listen to configuration changes
        this.disposables.push(this.configService.onConfigurationChanged(() => {
            // Refresh ASR configuration if needed
            this.asrManager.updateConfiguration({
                language: this.configService.getLanguage(),
                maxTokens: this.configService.getMaxTokens()
            });
        }));
    }
    async initialize() {
        try {
            this.updateState('loading');
            await this.asrManager.initialize();
            this.updateState('idle');
        }
        catch (error) {
            console.error('Failed to initialize ASR:', error);
            this.updateState('error');
            throw error;
        }
    }
    async toggleRecording() {
        if (this.currentState === 'recording') {
            await this.stopRecording();
        }
        else if (this.currentState === 'idle') {
            await this.startRecording();
        }
        else {
            vscode.window.showWarningMessage(`Cannot toggle recording in current state: ${this.currentState}`);
        }
    }
    async startRecording() {
        try {
            if (this.currentState !== 'idle') {
                throw new Error(`Cannot start recording in state: ${this.currentState}`);
            }
            this.updateState('recording');
            await this.audioRecorder.startRecording();
        }
        catch (error) {
            console.error('Failed to start recording:', error);
            this.updateState('idle');
            if (error instanceof Error) {
                if (error.name === 'NotAllowedError') {
                    vscode.window.showErrorMessage('Microphone access denied. Please allow microphone access in your browser/system settings.');
                }
                else if (error.name === 'NotFoundError') {
                    vscode.window.showErrorMessage('No microphone found. Please connect a microphone and try again.');
                }
                else {
                    vscode.window.showErrorMessage(`Failed to start recording: ${error.message}`);
                }
            }
            throw error;
        }
    }
    async stopRecording() {
        try {
            if (this.currentState !== 'recording') {
                return;
            }
            this.updateState('transcribing');
            const audioData = await this.audioRecorder.stopRecording();
            if (audioData && audioData.length > 0) {
                const language = this.configService.getLanguage();
                await this.asrManager.transcribe(audioData, language);
            }
            else {
                this.updateState('idle');
                vscode.window.showWarningMessage('No audio data recorded.');
            }
        }
        catch (error) {
            console.error('Failed to stop recording:', error);
            this.updateState('idle');
            vscode.window.showErrorMessage(`Failed to process recording: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    updateState(newState) {
        if (this.currentState !== newState) {
            this.currentState = newState;
            this._onStateChange.fire(newState);
        }
    }
    async handleTranscriptionResult(result) {
        if (result.isComplete) {
            this.updateState('idle');
            if (result.text.trim()) {
                if (this.configService.getAutoInsertInEditor()) {
                    await this.insertTextInEditor(result.text);
                }
                else {
                    // Show the result and let user decide
                    const action = await vscode.window.showInformationMessage(`Transcription: "${result.text}"`, 'Insert in Editor', 'Copy to Clipboard');
                    if (action === 'Insert in Editor') {
                        await this.insertTextInEditor(result.text);
                    }
                    else if (action === 'Copy to Clipboard') {
                        await vscode.env.clipboard.writeText(result.text);
                    }
                }
            }
            else {
                vscode.window.showWarningMessage('No speech detected in recording.');
            }
        }
    }
    async insertTextInEditor(text) {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const position = editor.selection.active;
            await editor.edit(editBuilder => {
                editBuilder.insert(position, text);
            });
        }
        else {
            // No active editor, copy to clipboard instead
            await vscode.env.clipboard.writeText(text);
            vscode.window.showInformationMessage('No active editor. Text copied to clipboard.');
        }
    }
    mapASRStateToTranscriptionState(asrState) {
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
    dispose() {
        this._onStateChange.dispose();
        this.asrManager.dispose();
        this.audioRecorder.dispose();
        this.disposables.forEach(d => d.dispose());
    }
}
exports.TranscriptionService = TranscriptionService;
//# sourceMappingURL=transcriptionService.js.map