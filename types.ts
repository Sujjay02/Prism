export interface GeneratedUI {
  explanation: string;
  code: string;
  sources?: { title: string; uri: string }[];
}

export interface UploadedFile {
  data: string; // base64 string
  mimeType: string;
  fileName?: string;
}

export interface HistoryItem {
  id: string;
  prompt: string;
  files?: UploadedFile[];
  result: GeneratedUI;
  timestamp: number;
}

export interface InputAreaProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  files: UploadedFile[];
  setFiles: (files: UploadedFile[]) => void;
  onGenerate: () => void;
  loading: boolean;
}

export interface CodePreviewProps {
  html: string;
}

export interface CodeViewerProps {
  code: string;
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
  currentId?: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export interface HeaderProps {
  isDark: boolean;
  toggleTheme: () => void;
  onReset: () => void;
}