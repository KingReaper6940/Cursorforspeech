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
exports.ASRManager = void 0;
const vscode = __importStar(require("vscode"));
class ASRManager {
    constructor(context) {
        this.context = context;
        this._onStateChange = new vscode.EventEmitter();
        this.onStateChange = this._onStateChange.event;
        this._onTranscriptionResult = new vscode.EventEmitter();
        this.onTranscriptionResult = this._onTranscriptionResult.event;
        this.currentState = 'uninitialized';
        this.worker = null;
        this.isWebGPUSupported = false;
        // Context may be used for resource management in future
        void this.context; // Suppress unused parameter warning
    }
    async initialize() {
        this.updateState('initializing');
        try {
            // Check WebGPU support
            this.isWebGPUSupported = await this.checkWebGPUSupport();
            if (!this.isWebGPUSupported) {
                throw new Error('WebGPU is not supported in this environment');
            }
            // Initialize the ASR worker in a webview context
            await this.initializeWorker();
            this.updateState('ready');
        }
        catch (error) {
            console.error('ASR initialization failed:', error);
            this.updateState('error');
            throw error;
        }
    }
    async transcribe(audioData, language) {
        if (this.currentState !== 'ready') {
            throw new Error(`Cannot transcribe in state: ${this.currentState}`);
        }
        this.updateState('transcribing');
        try {
            if (!this.worker) {
                throw new Error('ASR worker not initialized');
            }
            // Send audio data to worker for transcription
            this.worker.postMessage({
                type: 'transcribe',
                audioData: audioData,
                language: language
            });
        }
        catch (error) {
            this.updateState('ready');
            throw error;
        }
    }
    updateConfiguration(config) {
        if (this.worker) {
            this.worker.postMessage({
                type: 'updateConfig',
                config: config
            });
        }
    }
    async checkWebGPUSupport() {
        // In VS Code extension context, we need to check if the webview environment supports WebGPU
        // This is a simplified check - in practice, you might want to create a test webview
        return new Promise((resolve) => {
            // For now, we'll assume WebGPU is available if we're in a modern environment
            // In a real implementation, you'd create a temporary webview to test this
            const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : '';
            const isModernBrowser = userAgent.includes('Chrome') || userAgent.includes('Edge');
            resolve(isModernBrowser);
        });
    }
    async initializeWorker() {
        return new Promise((resolve, reject) => {
            try {
                this.updateState('loading');
                // Create worker using the existing worker code
                // Note: In a VS Code extension, we need to adapt this to work with the extension's resource loading
                const workerCode = this.getWorkerCode();
                const blob = new Blob([workerCode], { type: 'application/javascript' });
                const workerUrl = URL.createObjectURL(blob);
                this.worker = new Worker(workerUrl);
                this.worker.onmessage = (event) => {
                    const { type, data } = event.data;
                    switch (type) {
                        case 'ready':
                            this.updateState('ready');
                            resolve();
                            break;
                        case 'error':
                            this.updateState('error');
                            reject(new Error(data.message || 'Worker initialization failed'));
                            break;
                        case 'transcriptionResult':
                            this._onTranscriptionResult.fire({
                                text: data.text,
                                isComplete: data.isComplete,
                                confidence: data.confidence
                            });
                            if (data.isComplete) {
                                this.updateState('ready');
                            }
                            break;
                        case 'progress':
                            // Handle loading progress if needed
                            break;
                    }
                };
                this.worker.onerror = (error) => {
                    this.updateState('error');
                    reject(new Error(`Worker error: ${error.message}`));
                };
                // Initialize the worker
                this.worker.postMessage({ type: 'initialize' });
            }
            catch (error) {
                reject(error);
            }
        });
    }
    getWorkerCode() {
        // This is a simplified version - in practice, you'd bundle the worker code
        // or load it from the extension resources
        return `
            // Simplified ASR Worker for VS Code Extension
            let transformers = null;
            let model = null;
            let processor = null;

            async function loadTransformers() {
                try {
                    // Load Hugging Face Transformers
                    const module = await import('https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.5.0');
                    transformers = module;
                    transformers.env.backends.onnx.logLevel = 'info';
                    
                    // Load the Whisper model
                    postMessage({ type: 'progress', data: { message: 'Loading model...' } });
                    
                    model = await transformers.WhisperForConditionalGeneration.from_pretrained(
                        'Xenova/whisper-tiny.en', 
                        { 
                            quantized: true,
                            device: 'webgpu'
                        }
                    );
                    
                    processor = await transformers.AutoProcessor.from_pretrained('Xenova/whisper-tiny.en');
                    
                    postMessage({ type: 'ready' });
                } catch (error) {
                    postMessage({ type: 'error', data: { message: error.message } });
                }
            }

            async function transcribeAudio(audioData, language) {
                try {
                    if (!model || !processor) {
                        throw new Error('Model not loaded');
                    }

                    // Process the audio
                    const inputs = await processor(audioData);
                    
                    // Generate transcription
                    const output = await model.generate({
                        ...inputs,
                        max_new_tokens: 128,
                        language: language === 'auto' ? null : language
                    });

                    // Decode the output
                    const transcription = processor.batch_decode(output, { skip_special_tokens: true })[0];
                    
                    postMessage({ 
                        type: 'transcriptionResult', 
                        data: { 
                            text: transcription,
                            isComplete: true 
                        } 
                    });
                } catch (error) {
                    postMessage({ type: 'error', data: { message: error.message } });
                }
            }

            self.onmessage = async function(event) {
                const { type, audioData, language, config } = event.data;

                switch (type) {
                    case 'initialize':
                        await loadTransformers();
                        break;
                    case 'transcribe':
                        await transcribeAudio(audioData, language);
                        break;
                    case 'updateConfig':
                        // Handle configuration updates
                        break;
                }
            };
        `;
    }
    updateState(newState) {
        if (this.currentState !== newState) {
            this.currentState = newState;
            this._onStateChange.fire(newState);
        }
    }
    dispose() {
        if (this.worker) {
            this.worker.terminate();
            this.worker = null;
        }
        this._onStateChange.dispose();
        this._onTranscriptionResult.dispose();
    }
}
exports.ASRManager = ASRManager;
//# sourceMappingURL=asrManager.js.map