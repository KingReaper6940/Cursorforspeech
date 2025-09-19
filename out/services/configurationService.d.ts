import * as vscode from 'vscode';
export declare class ConfigurationService {
    private readonly configSection;
    getLanguage(): string;
    setLanguage(language: string): Promise<void>;
    getMaxTokens(): number;
    getAutoInsertInEditor(): boolean;
    setAutoInsertInEditor(value: boolean): Promise<void>;
    onConfigurationChanged(callback: () => void): vscode.Disposable;
}
//# sourceMappingURL=configurationService.d.ts.map