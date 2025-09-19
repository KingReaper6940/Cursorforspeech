# Contributing to Cursor for Speech

Thank you for your interest in contributing to Cursor for Speech! This document provides guidelines and information for contributors.

**Project Creator:** Vrishn Viswa Sathyamoorthy  
**Contact:** vrishnviswasathyamoorthy@gmail.com | +1 (914) 879-5242 | [@KingReaper96420](https://github.com/KingReaper96420)

## 🚀 Getting Started

### Prerequisites
- Node.js 16.x or higher
- npm 7.x or higher
- VS Code 1.74.0 or higher
- Git

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/KingReaper96420/cursorforspeech.git
   cd cursorforspeech
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Open in VS Code**
   ```bash
   code .
   ```

4. **Start Development**
   - Press `F5` to start the Extension Development Host
   - This will open a new VS Code window with your extension loaded
   - Make changes to the code and reload the window to test

### Building

```bash
# Compile TypeScript
npm run compile

# Watch mode for development
npm run watch

# Package for distribution
npm run package
```

## 🛠️ Project Structure

```
src/
├── extension.ts              # Main extension entry point
├── services/                 # Core services
│   ├── configurationService.ts
│   └── transcriptionService.ts
├── core/                     # Core functionality
│   ├── asrManager.ts        # ASR/Whisper integration
│   └── audioRecorder.ts     # Audio recording and processing
├── voicePanel.ts            # Webview panel UI
└── types.ts                 # TypeScript type definitions

media/                       # Webview resources
├── vscode.css              # VS Code theme styles

package.json                # Extension manifest
tsconfig.json              # TypeScript configuration
```

## 🐛 Bug Reports

When filing bug reports, please include:

1. **Environment Information:**
   - VS Code/Cursor version
   - Operating system and version
   - Extension version
   - WebGPU support status

2. **Reproduction Steps:**
   - Clear, step-by-step instructions
   - Expected vs actual behavior
   - Screenshots or recordings if helpful

3. **Logs:**
   - Open Developer Tools (`Cmd+Option+I` or `F12`)
   - Check the Console for error messages
   - Include relevant log output

## ✨ Feature Requests

We welcome feature requests! Please:

1. Check existing issues to avoid duplicates
2. Clearly describe the feature and use case
3. Consider if it fits the project's scope and goals
4. Be open to discussion and iteration

## 🔧 Development Guidelines

### Code Style
- Use TypeScript with strict type checking
- Follow the existing code style and patterns
- Use meaningful variable and function names
- Add JSDoc comments for public APIs

### Commit Messages
Use conventional commit format:
```
type(scope): description

feat(recorder): add real-time audio visualization
fix(asr): handle WebGPU initialization errors
docs(readme): update installation instructions
```

### Testing
- Test your changes in both development and packaged modes
- Verify functionality across different operating systems if possible
- Test with various audio input devices and scenarios
- Ensure accessibility and performance are maintained

### Pull Requests
1. Create a feature branch from `main`
2. Make your changes with clear, logical commits
3. Update documentation if needed
4. Test thoroughly
5. Submit a pull request with:
   - Clear description of changes
   - Link to related issues
   - Screenshots/videos for UI changes

## 🔒 Security

If you discover security vulnerabilities:
1. **DO NOT** open a public issue
2. Contact Vrishn Viswa Sathyamoorthy directly:
   - Email: vrishnviswasathyamoorthy@gmail.com
   - Phone: +1 (914) 879-5242
3. Provide detailed information about the vulnerability
4. Allow time for the issue to be addressed before disclosure

## 📜 Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help create a welcoming environment for all contributors
- Follow GitHub's Community Guidelines

## 🎯 Areas for Contribution

We especially welcome contributions in these areas:

### High Priority
- WebGPU compatibility improvements
- Audio processing optimization
- Error handling and user feedback
- Cross-platform testing and bug fixes

### Medium Priority
- Additional language support
- UI/UX improvements
- Performance optimizations
- Documentation improvements

### Future Enhancements
- Real-time streaming transcription
- Custom model support
- Integration with more VS Code features
- Advanced configuration options

## 🤝 Community

- Join discussions in GitHub Issues
- Share feedback and suggestions
- Help answer questions from other users
- Contribute to documentation and examples

## 📚 Resources

- [VS Code Extension API](https://code.visualstudio.com/api)
- [Hugging Face Transformers.js](https://huggingface.co/docs/transformers.js)
- [WebGPU Specification](https://www.w3.org/TR/webgpu/)
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)

Thank you for contributing to Cursor for Speech! 🎉

---

**© 2025 Vrishn Viswa Sathyamoorthy (@KingReaper96420)**  
*Licensed under MIT License for Personal Use Only*
