import * as vscode from 'vscode';
import { VoicePanel } from './voicePanel';
import { TranscriptionService } from './services/transcriptionService';
import { ConfigurationService } from './services/configurationService';

let transcriptionService: TranscriptionService;
let configurationService: ConfigurationService;

export function activate(context: vscode.ExtensionContext) {
    console.log('Cursor for Speech extension is now active!');

    // Initialize services
    configurationService = new ConfigurationService();
    transcriptionService = new TranscriptionService(context, configurationService);

    // Register commands
    const toggleRecordingCommand = vscode.commands.registerCommand(
        'cursorforspeech.toggleRecording',
        async () => {
            await transcriptionService.toggleRecording();
        }
    );

    const openVoicePanelCommand = vscode.commands.registerCommand(
        'cursorforspeech.openVoicePanel',
        () => {
            VoicePanel.createOrShow(context.extensionUri, transcriptionService, configurationService);
        }
    );

    const selectLanguageCommand = vscode.commands.registerCommand(
        'cursorforspeech.selectLanguage',
        async () => {
            const languages = [
                { label: 'Auto Detect', value: 'auto' },
                { label: 'English', value: 'english' },
                { label: 'Chinese', value: 'chinese' },
                { label: 'German', value: 'german' },
                { label: 'Spanish', value: 'spanish' },
                { label: 'Russian', value: 'russian' },
                { label: 'Korean', value: 'korean' },
                { label: 'French', value: 'french' },
                { label: 'Japanese', value: 'japanese' },
                { label: 'Portuguese', value: 'portuguese' },
                { label: 'Turkish', value: 'turkish' },
                { label: 'Polish', value: 'polish' },
                { label: 'Italian', value: 'italian' },
                { label: 'Dutch', value: 'dutch' },
                { label: 'Arabic', value: 'arabic' },
                { label: 'Swedish', value: 'swedish' },
                { label: 'Finnish', value: 'finnish' },
                { label: 'Norwegian', value: 'norwegian' },
                { label: 'Danish', value: 'danish' },
                { label: 'Hindi', value: 'hindi' },
                { label: 'Thai', value: 'thai' },
                { label: 'Vietnamese', value: 'vietnamese' }
            ];

            const selectedLanguage = await vscode.window.showQuickPick(languages, {
                placeHolder: 'Select language for voice recognition'
            });

            if (selectedLanguage) {
                await configurationService.setLanguage(selectedLanguage.value);
                vscode.window.showInformationMessage(`Voice recognition language set to: ${selectedLanguage.label}`);
            }
        }
    );

    // Register status bar item
    const statusBarItem = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Right,
        100
    );
    statusBarItem.command = 'cursorforspeech.toggleRecording';
    statusBarItem.text = '$(mic) Speech';
    statusBarItem.tooltip = 'Toggle Voice Recording (Ctrl+Shift+V / Cmd+Shift+V)';
    statusBarItem.show();

    // Update status bar based on transcription state
    transcriptionService.onStateChange((state) => {
        switch (state) {
            case 'idle':
                statusBarItem.text = '$(mic) Speech';
                statusBarItem.backgroundColor = undefined;
                break;
            case 'recording':
                statusBarItem.text = '$(primitive-square) Recording';
                statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
                break;
            case 'transcribing':
                statusBarItem.text = '$(sync~spin) Transcribing';
                statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.prominentBackground');
                break;
            case 'disabled':
                statusBarItem.text = '$(mic-off) Speech';
                statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.errorBackground');
                break;
            case 'loading':
                statusBarItem.text = '$(sync~spin) Loading';
                statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.prominentBackground');
                break;
        }
    });

    // Add subscriptions to context
    context.subscriptions.push(
        toggleRecordingCommand,
        openVoicePanelCommand,
        selectLanguageCommand,
        statusBarItem,
        transcriptionService
    );

    // Initialize the transcription service
    transcriptionService.initialize().catch(error => {
        console.error('Failed to initialize transcription service:', error);
        vscode.window.showErrorMessage('Failed to initialize voice recognition. WebGPU support may be required.');
    });
}

export function deactivate() {
    if (transcriptionService) {
        transcriptionService.dispose();
    }
}
