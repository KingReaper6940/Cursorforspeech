import * as vscode from 'vscode';
import { TranscriptionService } from './services/transcriptionService';
import { ConfigurationService } from './services/configurationService';
export declare class VoicePanel {
    private transcriptionService;
    private configService;
    static currentPanel: VoicePanel | undefined;
    static readonly viewType = "cursorForSpeechVoicePanel";
    private readonly _panel;
    private readonly _extensionUri;
    private _disposables;
    static createOrShow(extensionUri: vscode.Uri, transcriptionService: TranscriptionService, configService: ConfigurationService): void;
    private constructor();
    dispose(): void;
    private _update;
    private _getHtmlForWebview;
}
//# sourceMappingURL=voicePanel.d.ts.map