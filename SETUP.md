# Quick Setup Guide

## Prerequisites

- Node.js (version 16 or higher)
- VS Code or Cursor
- Git (optional)

## Installation Steps

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Compile the TypeScript**:
   ```bash
   npm run compile
   ```

3. **Test the extension**:
   - Press `F5` in VS Code to open Extension Development Host
   - Or run: `npm run watch` for auto-compilation during development

4. **Package for distribution** (optional):
   ```bash
   npm install -g vsce
   vsce package
   ```

## Development Workflow

1. Make changes to `src/extension.ts`
2. Run `npm run compile` or `npm run watch`
3. Press `F5` to test in a new VS Code window
4. Check the Debug Console for any errors

## Testing the Extension

1. Open the Extension Development Host window (F5)
2. Open any text file
3. Use one of these methods to test:
   - Command Palette: `Ctrl+Shift+P` → "Start Voice Prompt"
   - Keyboard: `Ctrl+Shift+V`
   - Status Bar: Click the microphone icon
4. Grant microphone permissions when prompted
5. Speak into your microphone
6. Verify text appears at cursor position

## Troubleshooting

- **Permission issues**: Make sure microphone access is granted
- **Whisper loading errors**: Check browser console for details
- **Compilation errors**: Run `npm run compile` and check for TypeScript errors
