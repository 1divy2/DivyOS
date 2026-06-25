# DivyOS Terminal Architecture

The `divysh` (Divy Shell) is the flagship experience of DivyOS. It simulates a fully functional Unix-like command-line interface.

## Current State
- Built as a React application (`Terminal.tsx`).
- Basic history, output rendering, and a few hardcoded commands.

## Target Architecture (To Be Implemented)

### 1. Command Parser
A robust input parser that handles:
- Command extraction.
- Argument parsing (flags, positional arguments).
- Quoted strings.

### 2. Execution Engine
A mapping of command names to asynchronous execution functions.
Commands will have access to a context object:
```typescript
interface TerminalContext {
  print: (text: ReactNode) => void;
  clear: () => void;
  cwd: string;
  setCwd: (path: string) => void;
  osStore: OSState; // Access to open other windows, change settings
}
```

### 3. File System Emulation
Integration with the Virtual File System to allow `cd`, `ls`, `cat`, `mkdir`, etc.

### 4. Planned Command Categories
- **System:** `clear`, `help`, `date`, `whoami`, `reboot`, `theme`
- **Navigation:** `cd`, `ls`, `pwd`
- **Files:** `cat`, `touch`, `rm`
- **Network (Parody):** `ping`, `curl`, `ssh` (easter eggs)
- **Divy Specific:** `resume`, `projects`, `github`, `contact`
- **Package Manager:** `apt` or `npm` parody for "installing" new games/themes.

### 5. UI Features
- Tab Autocomplete.
- Up/Down arrow for history.
- ANSI color code parsing (or React equivalent for styled output).
- Blinking cursor and authentic typography.
