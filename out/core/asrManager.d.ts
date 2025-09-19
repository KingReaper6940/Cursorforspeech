import * as vscode from 'vscode';
export type ASRState = 'uninitialized' | 'initializing' | 'loading' | 'ready' | 'transcribing' | 'error';
export interface ASRConfiguration {
    language: string;
    maxTokens: number;
}
export interface TranscriptionResult {
    text: string;
    isComplete: boolean;
    confidence?: number;
}
export declare class ASRManager implements vscode.Disposable {
    private readonly context;
    private readonly _onStateChange;
    readonly onStateChange: vscode.Event<ASRState>;
    private readonly _onTranscriptionResult;
    readonly onTranscriptionResult: vscode.Event<TranscriptionResult>;
    private currentState;
    private worker;
    private isWebGPUSupported;
    constructor(context: vscode.ExtensionContext);
    initialize(): Promise<void>;
    transcribe(audioData: Float32Array, language: string): Promise<void>;
    updateConfiguration(config: ASRConfiguration): void;
    private checkWebGPUSupport;
    private initializeWorker;
    private getWorkerCode;
    private updateState;
    dispose(): void;
}
//# sourceMappingURL=asrManager.d.ts.map