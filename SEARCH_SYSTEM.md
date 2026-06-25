# DivyOS Search System

The search architecture is designed to be the central nervous system for finding anything within DivyOS.

## Current State
Currently a basic implementation, likely tied to a generic UI component.

## Target Architecture

### 1. Global Command Menu (Spotlight/Raycast clone)
Triggered by a keyboard shortcut (e.g., Cmd/Ctrl + K).

### 2. Indexing Engine
A lightweight client-side indexing system that aggregates searchable items from:
- **Registry:** Application names and descriptions.
- **Content:** Project titles, resume sections, skills.
- **Files:** Virtual file names.
- **Commands:** Terminal commands.
- **Settings:** Quick toggles for theme, volume, etc.

### 3. UI Implementation
- Built using `cmdk` for accessibility and keyboard navigation.
- Real-time filtering.
- Visual categorization (Apps, Files, Settings).

### 4. Action Execution
Selecting a search result should trigger a system action:
- Opening an app.
- Opening a specific file inside an app.
- Executing a terminal command.
- Changing a setting directly.
