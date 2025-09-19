# Installation Guide for Yap for Cursor VS Code Extension

## 📦 Installation Options

### Option 1: Install from VSIX File (Ready to Use!)

The extension has been packaged and is ready for installation:

**File:** `yap-for-cursor-1.0.0.vsix` (34.08 KB)

**Installation Steps:**

1. **Open VS Code or Cursor**

2. **Install from VSIX:**
   - Open Command Palette (`Cmd+Shift+P` / `Ctrl+Shift+P`)
   - Type: `Extensions: Install from VSIX...`
   - Select the `yap-for-cursor-1.0.0.vsix` file
   - Click "Install"

3. **Restart VS Code/Cursor**
   - Close and reopen the editor to ensure proper loading

4. **Verify Installation:**
   - Look for "🗣️ Yap" in the status bar (bottom right)
   - Open Command Palette and search for "Yap" commands

### Option 2: Development Installation

If you want to develop or modify the extension:

1. **Open Extension Directory in VS Code:**
   ```bash
   code /path/to/yap-for-cursor
   ```

2. **Press F5** to launch Extension Development Host
   - This opens a new VS Code window with the extension loaded
   - Make changes and reload to test

## 🚀 Quick Start

### First Use

1. **Click the "🗣️ Yap" button** in the status bar
2. **Allow microphone access** when prompted
3. **Wait for model download** (first time only, 1-5 minutes)
4. **Click microphone button** to start recording
5. **Speak clearly** and click again to stop
6. **Text appears** in your active editor!

### Available Commands

Access via Command Palette (`Cmd+Shift+P` / `Ctrl+Shift+P`):

- `Yap: Toggle Voice Recording`
- `Yap: Open Voice Panel`
- `Yap: Select Voice Recognition Language`

### Hotkeys

- **Toggle Recording:** `Cmd+Shift+Y` (Mac) / `Ctrl+Shift+Y` (Windows/Linux)

### Voice Panel

Open the full-featured panel:
- Command: `Yap: Open Voice Panel`
- Or right-click the status bar item

Features:
- Visual recording controls
- Language selection (60+ languages)
- Settings configuration
- Real-time status updates

## ⚙️ Configuration

Open VS Code Settings (`Cmd+,` / `Ctrl+,`) and search for "Yap":

### Available Settings

- **`yap-for-cursor.language`**
  - Default: `"auto"`
  - Options: Auto-detect or specific language
  - Description: Language for voice recognition

- **`yap-for-cursor.maxTokens`**
  - Default: `128`
  - Range: 1-512
  - Description: Maximum tokens for transcription output

- **`yap-for-cursor.autoInsertInEditor`**
  - Default: `true`
  - Description: Automatically insert transcribed text into active editor

### Example Configuration

Add to your VS Code `settings.json`:

```json
{
  "yap-for-cursor.language": "english",
  "yap-for-cursor.maxTokens": 256,
  "yap-for-cursor.autoInsertInEditor": true
}
```

## 🖥️ System Requirements

### Minimum Requirements

- **VS Code/Cursor:** 1.74.0 or higher
- **Node.js:** 16.x or higher (for development)
- **Operating System:** Windows 10+, macOS 10.15+, Ubuntu 18.04+

### Recommended Requirements

- **WebGPU Support:** For optimal performance
- **Modern Browser Engine:** Chrome 90+, Edge 90+, or equivalent
- **RAM:** 4GB+ available (for model loading)
- **Internet:** Required for initial model download (~100MB)

### Hardware

- **Microphone:** Any system microphone or external mic
- **GPU:** WebGPU-compatible GPU recommended (NVIDIA, AMD, Intel)

## 🔧 Troubleshooting

### Common Issues

**Extension not showing in status bar:**
- Restart VS Code/Cursor
- Check if extension is enabled in Extensions panel
- Try reinstalling the VSIX file

**"WebGPU not supported" error:**
- Update your browser/editor to latest version
- Enable hardware acceleration in settings
- Update graphics drivers

**Microphone access denied:**
- Grant microphone permissions in system settings
- Restart the editor after granting permissions
- Check privacy settings (Windows/macOS)

**Model download takes too long:**
- Ensure stable internet connection
- First download can take 1-5 minutes
- Model is cached for future use

**No transcription output:**
- Speak clearly and at normal volume
- Check microphone is working in other apps
- Try changing the language setting

### Advanced Troubleshooting

**Enable Debug Mode:**
1. Open Developer Tools (`Cmd+Option+I` / `F12`)
2. Check Console for error messages
3. Look for "Yap" or "ASR" related logs

**Reset Extension State:**
1. Uninstall extension
2. Clear VS Code cache/settings
3. Reinstall extension

## 📞 Support

If you encounter issues:

1. **Check the Console:** Look for error messages in Developer Tools
2. **Update Everything:** Ensure VS Code, drivers, and system are up to date
3. **File an Issue:** Report problems on GitHub with:
   - System information (OS, VS Code version, etc.)
   - Error messages from console
   - Steps to reproduce the issue

## 🎉 Success!

Once installed, you should see:
- ✅ "🗣️ Yap" button in status bar
- ✅ Voice commands available in Command Palette
- ✅ Hotkey (`Cmd+Shift+Y`) working
- ✅ Settings under "Yap for Cursor" section

**Happy Voice Coding!** 🎤➡️💻
