declare global {
    interface Window {
        transformers?: any;
        _asrGlobalHandlerAttached?: boolean;
    }
}
export interface NavigatorWithMaybeGPU extends Navigator {
    gpu?: {
        requestAdapter: () => Promise<GPUAdapter | null>;
    };
}
export interface GPUAdapter {
    requestDevice: () => Promise<GPUDevice>;
}
export interface GPUDevice {
    createCommandEncoder: () => GPUCommandEncoder;
}
export interface GPUCommandEncoder {
    finish: () => GPUCommandBuffer;
}
interface GPUCommandBuffer {
}
export interface AsrStatusUpdateDetail {
    state: AsrManagerState;
    message?: string;
}
export interface AsrResultDetail {
    status: "update" | "complete" | "error" | "transcribing_start";
    output?: string;
    tps?: number;
    numTokens?: number;
    data?: string;
}
export type MicButtonState = "idle" | "recording" | "transcribing" | "disabled";
export type AsrManagerState = "uninitialized" | "initializing" | "loading_model" | "warming_up" | "ready" | "error";
export interface MicButtonElement extends HTMLDivElement {
    asrState?: MicButtonState;
}
export interface AsrInstance {
    mic: MicButtonElement;
    chatInputContentEditable: HTMLDivElement;
}
export interface WorkerGenerateData {
    audio: Float32Array;
    language: string;
}
export interface WorkerMessage {
    type: "load" | "generate" | "stop";
    data?: WorkerGenerateData;
}
export interface WorkerResponse {
    status: "loading" | "ready" | "error" | "update" | "complete" | "transcribing_start";
    data?: string;
    output?: string;
    tps?: number;
    numTokens?: number;
}
export {};
//# sourceMappingURL=types.d.ts.map