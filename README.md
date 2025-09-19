# <p align="center"><img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Telegram-Animated-Emojis/main/People/Speaking%20Head.webp" alt="Speaking Head" width="128" height="128" /><br/> Cursor for Speech - VS Code Extension </p>

🎤 Local, WebGPU-powered voice-to-text capabilities directly into the Cursor/VS Code editor using the power of Hugging Face Transformers.

**Created by Vrishn Viswa Sathyamoorthy**

📧 **Contact:** vrishnviswasathyamoorthy@gmail.com | 📱 **Phone:** +1 (914) 879-5242 | 🐙 **GitHub:** [@KingReaper96420](https://github.com/KingReaper96420)

[![VS Code Marketplace](https://img.shields.io/badge/VS%20Code-Extension-blue?style=for-the-badge&logo=visual-studio-code)](https://marketplace.visualstudio.com/)
[![GitHub](https://img.shields.io/badge/GitHub-KingReaper96420-181717?style=for-the-badge&logo=github)](https://github.com/KingReaper96420)
[![Contact](https://img.shields.io/badge/Contact-Vrishn%20Viswa%20Sathyamoorthy-blue?style=for-the-badge)](mailto:vrishnviswasathyamoorthy@gmail.com)

## ✨ Features

- 🎙️ **LOCAL VOICE TRANSCRIPTION:** Transcribe your speech directly into the editor using the power of Hugging Face Transformers (Whisper model).
- 🔒 **IN-BROWSER PROCESSING:** All transcription happens _locally_ in your editor. No data sent to external servers (besides downloading the model initially).
- 🖱️ **SEAMLESS INTEGRATION:** Native VS Code extension with status bar integration and webview panel.
 - ⌨️ **HOTKEY SUPPORT:** Use `Cmd+Shift+V` (Mac) or `Ctrl+Shift+V` (Windows/Linux) to toggle recording.
- 🌍 **MULTI-LANGUAGE:** Support for 60+ languages including auto-detection.
- ⚙️ **CONFIGURABLE:** Customize language, auto-insertion, and other settings.

## 🚀 Installation Guide

### Option 1: From VS Code Marketplace (Recommended)

1. Open VS Code/Cursor
2. Go to Extensions (`Cmd+Shift+X` or `Ctrl+Shift+X`)
3. Search for "Cursor for Speech"
4. Click "Install"

### Option 2: Install from VSIX

1. **Download the VSIX file** from the releases page
2. **Install via VS Code:**
   - Open Command Palette (`Cmd+Shift+P` or `Ctrl+Shift+P`)
   - Run: `Extensions: Install from VSIX...`
   - Select the `cursorforspeech-3.0.0.vsix` file

### Option 3: Build from Source

1. **Clone the Repository**
   ```bash
   git clone https://github.com/KingReaper96420/cursorforspeech.git
   cd cursorforspeech
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Compile and Package**
   ```bash
   npm run compile
   npm run package
   ```

4. **Install the generated VSIX**
   ```bash
   code --install-extension cursorforspeech-3.0.0.vsix
   ```

## 🛠️ How to Use

### Quick Start
1. 🎤 Click the **"🎤 Speech"** button in the status bar (bottom right)
2. ⏳ The first time, the AI model needs to download (please wait a moment)
3. 🔴 Click the microphone button to **start recording**
4. 🗣️ Speak clearly
5. ⏹️ Click again to **stop recording**
6. ⌨️ Your transcribed text will appear in the active editor!

### Available Commands
- **`Cursor for Speech: Toggle Voice Recording`** - Start/stop voice recording
- **`Cursor for Speech: Open Voice Panel`** - Open the voice control panel
- **`Cursor for Speech: Select Voice Recognition Language`** - Choose transcription language

### Hotkeys
- `Cmd+Shift+V` (Mac) or `Ctrl+Shift+V` (Windows/Linux) - Toggle recording

### Editor Toolbar Mic Button
- A microphone icon appears in the editor toolbar (top-right) for any text-based editor
- Click it to start/stop recording; transcription inserts at the cursor position

### Voice Panel
Access the full-featured voice panel via:
- Command Palette: `Cursor for Speech: Open Voice Panel`
- Status bar button (right-click for menu)

The panel provides:
- Visual recording controls with real-time feedback
- Language selection (60+ supported languages)
- Auto-insertion toggle
- Recording status and help

## ⚙️ Configuration

Open VS Code Settings (`Cmd+,` or `Ctrl+,`) and search for "Cursor for Speech" to configure:

- **Language:** Set the default transcription language (default: auto-detect)
- **Max Tokens:** Maximum length of transcription output (default: 128)
- **Auto Insert:** Automatically insert transcribed text into the active editor (default: true)

## 🖥️ Compatibility

- ✅ **VS Code/Cursor:** 1.74.0+
- ✅ **WebGPU Required:** For optimal performance (may work with fallback on some systems)
- ✅ **Operating Systems:**
  - macOS (Apple Silicon & Intel)
  - Windows 10/11
  - Linux (Ubuntu, Fedora, etc.)

## 🌍 Supported Languages

Auto-detect and 60+ languages including:
- English, Chinese, German, Spanish, French
- Japanese, Korean, Russian, Portuguese, Italian
- Arabic, Hindi, Dutch, Swedish, Norwegian
- And many more...

## 🔧 Troubleshooting

### Common Issues

**"WebGPU not supported"**
- Ensure you're using a modern browser/editor version
- Check if hardware acceleration is enabled
- Try updating your graphics drivers

**"Microphone access denied"**
- Grant microphone permissions in your system settings
- Restart VS Code/Cursor after granting permissions

**"Model loading takes too long"**
- First-time model download can take 1-5 minutes depending on connection
- Subsequent uses will be much faster (model is cached)

**"No transcription output"**
- Ensure you're speaking clearly and loudly enough
- Check that your microphone is working in other applications
- Try adjusting the language setting if auto-detect isn't working

### Development/Debug Mode

1. Open the extension development host:
   ```bash
   code --extensionDevelopmentPath=./path/to/yap-for-cursor
   ```

2. Open Developer Tools (`Cmd+Option+I` or `F12`) to see console logs

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License for **Personal Use Only** - see the [LICENSE](LICENSE) file for details.

**Copyright © 2025 Vrishn Viswa Sathyamoorthy**
- GitHub: [@KingReaper96420](https://github.com/KingReaper96420)
- Email: vrishnviswasathyamoorthy@gmail.com
- Phone: +1 (914) 879-5242

## ❤️ Support The Developer

If you find `cursorforspeech` helpful, consider supporting Vrishn Viswa Sathyamoorthy!

📧 **Email:** vrishnviswasathyamoorthy@gmail.com  
📱 **Phone:** +1 (914) 879-5242  
🐙 **GitHub:** [@KingReaper96420](https://github.com/KingReaper96420)  

⭐ **Star the repository** if you find it useful!

---

## 🔄 Migration from Yap for Cursor

If you were using the previous "Yap for Cursor" extension:

1. **Uninstall the old setup:**
   - Remove the custom CSS imports from your VS Code settings
   - Disable/uninstall the "Custom CSS and JS Loader" extension
   - Run `Disable Custom CSS and JS` command if you had it enabled

2. **Install this extension** following the installation guide above

3. **Enjoy the improved experience** with native VS Code integration!

---

[![Star History Chart](https://api.star-history.com/svg?repos=KingReaper96420/cursorforspeech&type=Date)](https://www.star-history.com/#KingReaper96420/cursorforspeech&Date)

---

**© 2025 Vrishn Viswa Sathyamoorthy (@KingReaper96420) - All Rights Reserved**  
*Licensed under MIT License for Personal Use Only*