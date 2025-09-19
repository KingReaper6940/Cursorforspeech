import * as vscode from 'vscode';
import { ConfigurationService } from './configurationService';
export type TranscriptionState = 'idle' | 'recording' | 'transcribing' | 'disabled' | 'loading' | 'error' | 'uninitialized' | 'initializing';
export declare class TranscriptionService implements vscode.Disposable {
    private readonly context;
    private configService;
    private readonly _onStateChange;
    readonly onStateChange: vscode.Event<TranscriptionState>;
    private asrManager;
    private audioRecorder;
    private currentState;
    private disposables;
    constructor(context: vscode.ExtensionContext, configService: ConfigurationService);
    initialize(): Promise<void>;
    toggleRecording(): Promise<void>;
    startRecording(): Promise<void>;
    stopRecording(): Promise<void>;
    private updateState;
    private handleTranscriptionResult;
    private insertTextInEditor;
    private mapASRStateToTranscriptionState;
    dispose(): void;
}
//# sourceMappingURL=transcriptionService.d.ts.map