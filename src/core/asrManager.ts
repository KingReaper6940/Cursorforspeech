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

export class ASRManager implements vscode.Disposable {
    private readonly _onStateChange = new vscode.EventEmitter<ASRState>();
    public readonly onStateChange = this._onStateChange.event;

    private readonly _onTranscriptionResult = new vscode.EventEmitter<TranscriptionResult>();
    public readonly onTranscriptionResult = this._onTranscriptionResult.event;

    private currentState: ASRState = 'uninitialized';
    private worker: Worker | null = null;
    private isWebGPUSupported = false;

    constructor(private readonly context: vscode.ExtensionContext) {
        // Context may be used for resource management in future
        void this.context; // Suppress unused parameter warning
    }

    async initialize(): Promise<void> {
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
        } catch (error) {
            console.error('ASR initialization failed:', error);
            this.updateState('error');
            throw error;
        }
    }

    async transcribe(audioData: Float32Array, language: string): Promise<void> {
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
        } catch (error) {
            this.updateState('ready');
            throw error;
        }
    }

    updateConfiguration(config: ASRConfiguration): void {
        if (this.worker) {
            this.worker.postMessage({
                type: 'updateConfig',
                config: config
            });
        }
    }

    private async checkWebGPUSupport(): Promise<boolean> {
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

    private async initializeWorker(): Promise<void> {
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

            } catch (error) {
                reject(error);
            }
        });
    }

    private getWorkerCode(): string {
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

    private updateState(newState: ASRState): void {
        if (this.currentState !== newState) {
            this.currentState = newState;
            this._onStateChange.fire(newState);
        }
    }

    dispose(): void {
        if (this.worker) {
            this.worker.terminate();
            this.worker = null;
        }
        this._onStateChange.dispose();
        this._onTranscriptionResult.dispose();
    }
}
