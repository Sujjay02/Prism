// Viewport types for responsive preview
export type Viewport = 'mobile' | 'tablet' | 'desktop' | 'full';

// View mode including new editor and diff modes
export type ViewMode = 'preview' | 'code' | 'python' | 'editor' | 'diff';

// Multi-file support
export interface GeneratedFile {
  filename: string;
  content: string;
  language: 'html' | 'css' | 'javascript' | 'typescript' | 'python';
}

export interface GeneratedUI {
  explanation: string;
  code: string;
  files?: GeneratedFile[]; // Multi-file support
  sources?: { title: string; uri: string }[];
}

// Template storage
export interface SavedTemplate {
  id: string;
  name: string;
  description: string;
  code: string;
  thumbnail?: string; // base64 screenshot
  category: string;
  createdAt: number;
  tags: string[];
}

export interface UploadedFile {
  data: string; // base64 string
  mimeType: string;
  fileName?: string;
}

// App categories for organization
export type AppCategory = 'dashboard' | 'landing' | 'form' | 'game' | 'visualization' | 'ecommerce' | 'social' | 'utility' | 'other';

// App settings for published apps
export interface AppSettings {
  name?: string;
  description?: string;
  icon?: string; // emoji
  category?: AppCategory;
  tags?: string[];
  isPinned?: boolean;
  isMobileFriendly?: boolean;
  hasErrors?: boolean;
  lastModified?: number;
  versionCount?: number;
  thumbnail?: string; // base64 screenshot
  folderId?: string;
}

// Folder for organizing apps
export interface AppFolder {
  id: string;
  name: string;
  color: string;
  createdAt: number;
}

export interface HistoryItem {
  id: string;
  prompt: string;
  files?: UploadedFile[];
  result: GeneratedUI;
  timestamp: number;
  isPublished?: boolean;
  appSettings?: AppSettings;
}

export interface InputAreaProps {
  prompt: string;
  setPrompt: (prompt: string | ((prev: string) => string)) => void;
  files: UploadedFile[];
  setFiles: (files: UploadedFile[] | ((prev: UploadedFile[]) => UploadedFile[])) => void;
  onGenerate: () => void;
  loading: boolean;
}

export interface CodePreviewProps {
  html: string;
}

export interface CodeViewerProps {
  code: string;
  explanation?: string;
}

export interface PythonRunnerProps {
  code: string;
  onFixError?: (code: string, error: string) => void;
}

export interface HistorySidebarProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
  onNewChat: () => void;
  onVoiceMode?: () => void;
  currentId?: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export interface HeaderProps {
  isDark: boolean;
  toggleTheme: () => void;
  onReset: () => void;
}
