import * as vscode from 'vscode';
export declare class AudioRecorder implements vscode.Disposable {
    private mediaRecorder;
    private audioChunks;
    private stream;
    private isRecording;
    startRecording(): Promise<void>;
    stopRecording(): Promise<Float32Array | null>;
    private processAudioBlob;
    private resampleAudio;
    private cleanup;
    dispose(): void;
}
//# sourceMappingURL=audioRecorder.d.ts.map