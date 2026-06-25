import type { ComponentType } from "react";
import { AboutApp } from "./apps/About";
import { ResumeApp } from "./apps/Resume";
import { ProjectsApp } from "./apps/Projects";
import { SkillsApp } from "./apps/Skills";
import { ExperienceApp } from "./apps/Experience";
import { GalleryApp } from "./apps/Gallery";
import { ContactApp } from "./apps/Contact";
import { SettingsApp } from "./apps/Settings";
import { TerminalApp } from "./apps/Terminal";
import { GitHubApp } from "./apps/GitHub";
import { NotesApp } from "./apps/Notes";
import { SystemMonitorApp } from "./apps/SystemMonitor";
import { CalculatorApp } from "./apps/Calculator";
import { CalendarApp } from "./apps/Calendar";
import { FilesApp } from "./apps/Files";
import { MusicApp } from "./apps/Music";
import { BrowserApp } from "./apps/Browser";
import { TrashApp } from "./apps/Trash";
import { SnakeApp } from "./apps/games/Snake";
import { TicTacToeApp } from "./apps/games/TicTacToe";
import { Game2048App } from "./apps/games/Game2048";
import { MinesweeperApp } from "./apps/games/Minesweeper";
import { FlappyApp } from "./apps/games/Flappy";

export type AppDef = {
  id: string;
  name: string;
  glyph: string;
  component: ComponentType<{ payload?: Record<string, unknown> }>;
  defaultSize?: { w: number; h: number };
  description: string;
  inDock?: boolean;
  category?: "system" | "personal" | "tools" | "games";
};

export const apps: AppDef[] = [
  // Personal
  { id: "about", name: "About", glyph: "◔", component: AboutApp, defaultSize: { w: 640, h: 560 }, description: "Who is Divy", inDock: true, category: "personal" },
  { id: "projects", name: "Projects", glyph: "◫", component: ProjectsApp, defaultSize: { w: 880, h: 560 }, description: "Real repos from GitHub", inDock: true, category: "personal" },
  { id: "resume", name: "Resume", glyph: "≡", component: ResumeApp, defaultSize: { w: 680, h: 600 }, description: "CV — view / print / download", inDock: true, category: "personal" },
  { id: "skills", name: "Skills", glyph: "◇", component: SkillsApp, defaultSize: { w: 640, h: 480 }, description: "Stack & tooling", category: "personal" },
  { id: "experience", name: "Experience", glyph: "│", component: ExperienceApp, defaultSize: { w: 640, h: 520 }, description: "Timeline of roles", category: "personal" },
  { id: "gallery", name: "Gallery", glyph: "▣", component: GalleryApp, defaultSize: { w: 720, h: 520 }, description: "Visual work", category: "personal" },
  { id: "contact", name: "Contact", glyph: "@", component: ContactApp, defaultSize: { w: 520, h: 420 }, description: "Reach out", category: "personal" },
  { id: "github", name: "GitHub", glyph: "⌥", component: GitHubApp, defaultSize: { w: 760, h: 520 }, description: "Live repos", category: "personal" },

  // Tools
  { id: "terminal", name: "Terminal", glyph: "▮", component: TerminalApp, defaultSize: { w: 760, h: 480 }, description: "divysh — control surface", inDock: true, category: "tools" },
  { id: "files", name: "Files", glyph: "📁", component: FilesApp, defaultSize: { w: 720, h: 480 }, description: "Browse the virtual FS", inDock: true, category: "tools" },
  { id: "notes", name: "Notes", glyph: "✎", component: NotesApp, defaultSize: { w: 640, h: 480 }, description: "Markdown scratchpad", category: "tools" },
  { id: "calculator", name: "Calculator", glyph: "÷", component: CalculatorApp, defaultSize: { w: 320, h: 460 }, description: "Quick math", category: "tools" },
  { id: "calendar", name: "Calendar", glyph: "▦", component: CalendarApp, defaultSize: { w: 480, h: 480 }, description: "Month view", category: "tools" },
  { id: "music", name: "Music", glyph: "♪", component: MusicApp, defaultSize: { w: 380, h: 580 }, description: "Background playlist", category: "tools" },
  { id: "browser", name: "Browser", glyph: "◯", component: BrowserApp, defaultSize: { w: 760, h: 520 }, description: "Quick links", category: "tools" },

  // System
  { id: "settings", name: "Settings", glyph: "⚙", component: SettingsApp, defaultSize: { w: 720, h: 540 }, description: "Wallpaper · theme · session", inDock: true, category: "system" },
  { id: "monitor", name: "System Monitor", glyph: "⌖", component: SystemMonitorApp, defaultSize: { w: 520, h: 560 }, description: "Real browser metrics", category: "system" },
  { id: "trash", name: "Trash", glyph: "∅", component: TrashApp, defaultSize: { w: 480, h: 360 }, description: "Deleted items", category: "system" },

  // Games
  { id: "snake", name: "Snake", glyph: "◉", component: SnakeApp, defaultSize: { w: 440, h: 520 }, description: "Classic snake", category: "games" },
  { id: "tictactoe", name: "Tic-Tac-Toe", glyph: "×○", component: TicTacToeApp, defaultSize: { w: 380, h: 460 }, description: "Two-player TTT", category: "games" },
  { id: "t2048", name: "2048", glyph: "2⁴", component: Game2048App, defaultSize: { w: 360, h: 460 }, description: "Slide & merge", category: "games" },
  { id: "minesweeper", name: "Minesweeper", glyph: "⚑", component: MinesweeperApp, defaultSize: { w: 360, h: 440 }, description: "Sweep the field", category: "games" },
  { id: "flappy", name: "Flappy", glyph: "𓅪", component: FlappyApp, defaultSize: { w: 380, h: 540 }, description: "Tap to fly", category: "games" },
];

export const byId = (id: string) => apps.find((a) => a.id === id);
