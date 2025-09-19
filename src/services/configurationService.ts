import * as vscode from 'vscode';

export class ConfigurationService {
    private readonly configSection = 'cursorforspeech';

    getLanguage(): string {
        const config = vscode.workspace.getConfiguration(this.configSection);
        return config.get('language', 'auto');
    }

    async setLanguage(language: string): Promise<void> {
        const config = vscode.workspace.getConfiguration(this.configSection);
        await config.update('language', language, vscode.ConfigurationTarget.Global);
    }

    getMaxTokens(): number {
        const config = vscode.workspace.getConfiguration(this.configSection);
        return config.get('maxTokens', 128);
    }

    getAutoInsertInEditor(): boolean {
        const config = vscode.workspace.getConfiguration(this.configSection);
        return config.get('autoInsertInEditor', true);
    }

    async setAutoInsertInEditor(value: boolean): Promise<void> {
        const config = vscode.workspace.getConfiguration(this.configSection);
        await config.update('autoInsertInEditor', value, vscode.ConfigurationTarget.Global);
    }

    onConfigurationChanged(callback: () => void): vscode.Disposable {
        return vscode.workspace.onDidChangeConfiguration((e) => {
            if (e.affectsConfiguration(this.configSection)) {
                callback();
            }
        });
    }
}
