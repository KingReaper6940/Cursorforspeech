# Change Log

All notable changes to the "cursorforspeech" extension will be documented in this file.

## [2.0.0] - 2024-09-19

### Major Rebrand
- 🎨 **Complete rebrand** from "Yap for Cursor" to "Cursor for Speech"
- 🖼️ **Custom icon** added to the extension package
- 🔄 **New command names** and configuration keys
- ⌨️ **Updated hotkey** from `Cmd+Shift+Y` to `Cmd+Shift+S`
- 🎤 **Updated branding** throughout UI, documentation, and code
- 📦 **New VSIX package** ready for installation (41.74 KB)

### Technical Changes
- All commands now use `cursorforspeech.*` namespace
- Configuration section renamed to `cursorforspeech.*`
- Status bar shows "Speech" instead of "Yap"
- Voice panel title updated to "Cursor for Speech Panel"
- Updated all documentation and help text

## [1.0.0] - 2024-01-XX

### Added
- 🎉 Initial release as a native VS Code extension
- 🎙️ Local voice-to-text transcription using Hugging Face Transformers (Whisper)
- 🔒 Complete local processing - no data sent to external servers
- ⌨️ Hotkey support (`Cmd+Shift+Y` / `Ctrl+Shift+Y`)
- 🌍 Support for 60+ languages with auto-detection
- 🖱️ Status bar integration with recording indicator
- 📱 Webview panel for advanced controls and settings
- ⚙️ Configurable language, max tokens, and auto-insertion settings
- 🎨 Native VS Code theming support
- 📝 Auto-insertion of transcribed text into active editor
- 📋 Copy to clipboard fallback when no editor is active

### Changed
- 🔄 Migrated from DOM injection approach to native VS Code extension
- 🏗️ Completely rewritten architecture using VS Code extension APIs
- 🎯 Improved user experience with better error handling and feedback
- 🚀 Enhanced performance and reliability

### Technical Improvements
- TypeScript-first development with strict type checking
- Modular service-based architecture
- Proper resource management and cleanup
- WebGPU-optimized audio processing
- Real-time audio visualization during recording

### Migration Notes
- Users migrating from the injection-based version should remove the "Custom CSS and JS Loader" setup
- All previous functionality is maintained and enhanced in this native extension
- Settings are automatically migrated to VS Code's native configuration system

---

## Future Releases

### Planned Features
- Real-time streaming transcription
- Custom model support
- Batch transcription of audio files
- Integration with more VS Code features (comments, terminal, etc.)
- Cloud model fallback options
- Advanced audio preprocessing options
