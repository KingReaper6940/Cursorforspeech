# 🎤 Cursor Speech-to-Text Extension

A VS Code/Cursor extension that adds speech-to-text functionality for writing prompts directly in the editor using voice commands. Perfect for dictating prompts, code comments, and documentation hands-free!

![GitHub](https://img.shields.io/badge/license-MIT-blue.svg)
![VS Code](https://img.shields.io/badge/VS%20Code-Extension-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)

## Features

- 🎤 **Voice-activated prompting**: Speak directly into your editor
- 🤖 **Local AI transcription**: Uses Whisper model for accurate speech recognition
- 🌐 **Web Speech API fallback**: Ensures compatibility across different environments
- 📍 **Cursor-aware insertion**: Text appears exactly where your cursor is positioned
- 📊 **Visual feedback**: Status bar indicator shows recording state
- ⌨️ **Keyboard shortcut**: Quick access via `Ctrl+Shift+V` (or `Cmd+Shift+V` on Mac)
- 🔒 **Privacy-focused**: All transcription happens locally, no data sent to servers

## 🚀 Installation

### Quick Start (From GitHub)

1. **Clone this repository**:
   ```bash
   git clone https://github.com/your-username/Cursorforspeech.git
   cd Cursorforspeech
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Compile the extension**:
   ```bash
   npm run compile
   ```

4. **Test the extension**:
   - Open this folder in VS Code/Cursor
   - Press `F5` to launch Extension Development Host
   - The extension will be active in the new window

### Install as VSIX Package

1. **Build the package**:
   ```bash
   npm install -g vsce
   vsce package
   ```

2. **Install in VS Code/Cursor**:
   ```bash
   code --install-extension speech-to-text-prompt-1.0.0.vsix
   # or for Cursor:
   cursor --install-extension speech-to-text-prompt-1.0.0.vsix
   ```

## Usage

### Starting Voice Transcription

There are multiple ways to start voice transcription:

1. **🎯 Editor Toolbar Button** (NEW!): 
   - Look for the microphone (🎤) icon in the top-right of your editor
   - Click it to start/stop recording

2. **⌨️ Keyboard Shortcut**: 
   - Press `Ctrl+Shift+V` (or `Cmd+Shift+V` on Mac)

3. **📝 Right-Click Menu**: 
   - Right-click in any editor and select "Start Voice Prompt"

4. **📊 Status Bar**: 
   - Click the prominent microphone icon in the status bar (bottom right)

5. **🎮 Command Palette**: 
   - Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
   - Type "Start Voice Prompt" and press Enter

### Recording Process

1. **Grant Permissions**: On first use, your browser will request microphone access
2. **Start Speaking**: Once recording begins, speak clearly into your microphone
3. **Stop Recording**: Click the status bar item again or wait for automatic stop
4. **View Results**: Transcribed text will be inserted at your cursor position

### Status Bar Indicators

- `🎤 Ready` - Extension is ready to record
- `🎤 Recording... (Click to stop)` - Currently recording audio
- `🎤 Transcribing with Whisper...` - Processing audio with local AI
- `🎤 Transcribing with Web Speech API...` - Using browser fallback

## Technology Stack

### Primary: Whisper Model (@xenova/transformers)
- **Accuracy**: High-quality local transcription
- **Privacy**: No data leaves your machine
- **Languages**: Optimized for English (whisper-tiny.en model)
- **Performance**: Runs efficiently in the browser

### Fallback: Web Speech API
- **Compatibility**: Works when Whisper model can't load
- **Speed**: Real-time transcription
- **Limitations**: Requires internet connection and browser support

## Requirements

- VS Code version 1.74.0 or higher
- Modern browser with microphone support
- Microphone access permissions

### Browser Compatibility

- ✅ Chrome/Chromium-based browsers
- ✅ Firefox
- ✅ Safari (with Web Speech API)
- ✅ Edge

## Troubleshooting

### Common Issues

**"Microphone access denied"**
- Grant microphone permissions in your browser
- Check VS Code/Cursor settings for media permissions

**"Whisper model failed to load"**
- The extension will automatically fallback to Web Speech API
- Ensure you have a stable internet connection for the initial model download

**"No speech detected"**
- Speak clearly and ensure your microphone is working
- Check your system's audio input settings
- Try speaking closer to the microphone

**"Web Speech API not supported"**
- Update to a modern browser version
- Use Chrome/Edge for best compatibility

### Performance Tips

- First-time Whisper model loading may take 30-60 seconds
- Subsequent uses will be much faster as the model is cached
- For best results, speak in a quiet environment

## Configuration

Currently, the extension works out-of-the-box with sensible defaults. Future versions may include:

- Language selection
- Model size options (tiny/base/small)
- Custom keyboard shortcuts
- Audio quality settings

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

### Development Setup

1. Clone the repository
2. Run `npm install`
3. Open in VS Code
4. Press `F5` to start debugging

### Building

```bash
# Compile TypeScript
npm run compile

# Watch for changes
npm run watch

# Package for distribution
vsce package
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Xenova/transformers](https://github.com/xenova/transformers.js) - For the excellent Whisper implementation
- [OpenAI Whisper](https://openai.com/research/whisper) - For the underlying speech recognition model
- VS Code team - For the excellent extension API

## Changelog

### 1.0.0
- Initial release
- Whisper model integration
- Web Speech API fallback
- Status bar integration
- Keyboard shortcuts
- Command palette integration
