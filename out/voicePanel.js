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
exports.VoicePanel = void 0;
const vscode = __importStar(require("vscode"));
class VoicePanel {
    static createOrShow(extensionUri, transcriptionService, configService) {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;
        if (VoicePanel.currentPanel) {
            VoicePanel.currentPanel._panel.reveal(column);
            return;
        }
        const panel = vscode.window.createWebviewPanel(VoicePanel.viewType, 'Cursor for Speech Voice Panel', column || vscode.ViewColumn.One, {
            enableScripts: true,
            localResourceRoots: [
                vscode.Uri.joinPath(extensionUri, 'media'),
                vscode.Uri.joinPath(extensionUri, 'out', 'compiled')
            ]
        });
        VoicePanel.currentPanel = new VoicePanel(panel, extensionUri, transcriptionService, configService);
    }
    constructor(panel, extensionUri, transcriptionService, configService) {
        this.transcriptionService = transcriptionService;
        this.configService = configService;
        this._disposables = [];
        this._panel = panel;
        this._extensionUri = extensionUri;
        this._update();
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
        this._panel.webview.onDidReceiveMessage(async (message) => {
            switch (message.type) {
                case 'toggleRecording':
                    await this.transcriptionService.toggleRecording();
                    break;
                case 'selectLanguage':
                    await this.configService.setLanguage(message.language);
                    this._update();
                    break;
                case 'toggleAutoInsert':
                    await this.configService.setAutoInsertInEditor(message.enabled);
                    this._update();
                    break;
            }
        }, null, this._disposables);
        // Listen to transcription state changes
        this.transcriptionService.onStateChange((state) => {
            this._panel.webview.postMessage({
                type: 'stateUpdate',
                state: state
            });
        });
    }
    dispose() {
        VoicePanel.currentPanel = undefined;
        this._panel.dispose();
        while (this._disposables.length) {
            const x = this._disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }
    _update() {
        const webview = this._panel.webview;
        this._panel.webview.html = this._getHtmlForWebview(webview);
    }
    _getHtmlForWebview(webview) {
        const styleVSCodeUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'vscode.css'));
        const nonce = getNonce();
        return `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}';">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link href="${styleVSCodeUri}" rel="stylesheet">
                <title>Cursor for Speech Voice Panel</title>
                <style>
                    body {
                        padding: 20px;
                        font-family: var(--vscode-font-family);
                    }
                    .container {
                        max-width: 500px;
                        margin: 0 auto;
                    }
                    .mic-button {
                        width: 80px;
                        height: 80px;
                        border-radius: 50%;
                        border: none;
                        background: var(--vscode-button-background);
                        color: var(--vscode-button-foreground);
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 24px;
                        margin: 20px auto;
                        transition: all 0.2s ease;
                    }
                    .mic-button:hover {
                        background: var(--vscode-button-hoverBackground);
                    }
                    .mic-button.recording {
                        background: var(--vscode-errorForeground);
                        animation: pulse 1s infinite;
                    }
                    .mic-button.transcribing {
                        background: var(--vscode-progressBar-background);
                        animation: spin 1s linear infinite;
                    }
                    .mic-button:disabled {
                        opacity: 0.5;
                        cursor: not-allowed;
                    }
                    @keyframes pulse {
                        0%, 100% { transform: scale(1); }
                        50% { transform: scale(1.1); }
                    }
                    @keyframes spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                    .status {
                        text-align: center;
                        margin: 10px 0;
                        color: var(--vscode-foreground);
                    }
                    .settings {
                        margin-top: 30px;
                        padding: 20px;
                        border: 1px solid var(--vscode-panel-border);
                        border-radius: 8px;
                    }
                    .setting-row {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin: 15px 0;
                    }
                    select, input[type="checkbox"] {
                        background: var(--vscode-input-background);
                        color: var(--vscode-input-foreground);
                        border: 1px solid var(--vscode-input-border);
                        padding: 5px;
                        border-radius: 4px;
                    }
                    .help-text {
                        font-size: 12px;
                        color: var(--vscode-descriptionForeground);
                        margin-top: 20px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>🎤 Cursor for Speech Panel</h1>
                    
                    <div style="text-align: center;">
                        <button id="micButton" class="mic-button">
                            <span id="micIcon">🎤</span>
                        </button>
                        <div id="status" class="status">Ready</div>
                    </div>

                    <div class="settings">
                        <h3>Settings</h3>
                        
                        <div class="setting-row">
                            <label for="languageSelect">Language:</label>
                            <select id="languageSelect">
                                <option value="auto">Auto Detect</option>
                                <option value="english">English</option>
                                <option value="chinese">Chinese</option>
                                <option value="german">German</option>
                                <option value="spanish">Spanish</option>
                                <option value="french">French</option>
                                <option value="japanese">Japanese</option>
                                <option value="korean">Korean</option>
                                <option value="russian">Russian</option>
                                <option value="portuguese">Portuguese</option>
                                <option value="italian">Italian</option>
                                <option value="dutch">Dutch</option>
                                <option value="arabic">Arabic</option>
                                <option value="hindi">Hindi</option>
                                <option value="thai">Thai</option>
                                <option value="vietnamese">Vietnamese</option>
                            </select>
                        </div>

                        <div class="setting-row">
                            <label for="autoInsertCheck">Auto-insert in editor:</label>
                            <input type="checkbox" id="autoInsertCheck" ${this.configService.getAutoInsertInEditor() ? 'checked' : ''}>
                        </div>
                    </div>

                    <div class="help-text">
                        <strong>How to use:</strong><br>
                        • Click the microphone button to start/stop recording<br>
                        • Use Cmd+Shift+S (Mac) or Ctrl+Shift+S (Windows/Linux) hotkey<br>
                        • Right-click the status bar item for quick access<br>
                        • First-time use may take a moment to download the AI model
                    </div>
                </div>

                <script nonce="${nonce}">
                    const vscode = acquireVsCodeApi();
                    const micButton = document.getElementById('micButton');
                    const micIcon = document.getElementById('micIcon');
                    const status = document.getElementById('status');
                    const languageSelect = document.getElementById('languageSelect');
                    const autoInsertCheck = document.getElementById('autoInsertCheck');

                    // Set initial language
                    languageSelect.value = '${this.configService.getLanguage()}';

                    let currentState = 'idle';

                    micButton.addEventListener('click', () => {
                        vscode.postMessage({ type: 'toggleRecording' });
                    });

                    languageSelect.addEventListener('change', (e) => {
                        vscode.postMessage({ 
                            type: 'selectLanguage', 
                            language: e.target.value 
                        });
                    });

                    autoInsertCheck.addEventListener('change', (e) => {
                        vscode.postMessage({ 
                            type: 'toggleAutoInsert', 
                            enabled: e.target.checked 
                        });
                    });

                    window.addEventListener('message', event => {
                        const message = event.data;
                        
                        if (message.type === 'stateUpdate') {
                            updateUI(message.state);
                        }
                    });

                    function updateUI(state) {
                        currentState = state;
                        micButton.className = 'mic-button ' + state;
                        
                        switch (state) {
                            case 'idle':
                                micIcon.textContent = '🎤';
                                status.textContent = 'Ready - Click to record';
                                micButton.disabled = false;
                                break;
                            case 'recording':
                                micIcon.textContent = '⏹️';
                                status.textContent = 'Recording... Click to stop';
                                micButton.disabled = false;
                                break;
                            case 'transcribing':
                                micIcon.textContent = '⚙️';
                                status.textContent = 'Transcribing...';
                                micButton.disabled = true;
                                break;
                            case 'loading':
                                micIcon.textContent = '⏳';
                                status.textContent = 'Loading AI model...';
                                micButton.disabled = true;
                                break;
                            case 'error':
                                micIcon.textContent = '❌';
                                status.textContent = 'Error - Check console';
                                micButton.disabled = true;
                                break;
                            case 'disabled':
                                micIcon.textContent = '🔇';
                                status.textContent = 'Disabled';
                                micButton.disabled = true;
                                break;
                        }
                    }
                </script>
            </body>
            </html>`;
    }
}
exports.VoicePanel = VoicePanel;
VoicePanel.viewType = 'cursorForSpeechVoicePanel';
function getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
//# sourceMappingURL=voicePanel.js.map