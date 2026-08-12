export type ChatPersona = "me" | "idol";

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  content: string;
  timestamp: string;
  error?: boolean;
}

export interface Project {
  id: string;
  title: string;
  category: "Hardware" | "Gaming & Mechanics" | "Software & OS" | "Math & Stats";
  description: string;
  tags: string[];
  image: string;
  featured?: boolean;
  link?: string;
  github?: string;
}

export interface PcSpec {
  component: string;
  model: string;
  iconName: string;
  detail: string;
}

export interface AiGameQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface AiGame {
  id: string;
  title: string;
  category: "Minecraft Mechanics" | "Hardware Simulator" | "Aim & Reflex" | "Math Logic" | "Anime Mechanics" | "AI Generated";
  description: string;
  tags: string[];
  difficulty: "Easy" | "Medium" | "Hard" | "AI Dynamic";
  iconName: string;
  builtByAi: string;
  playsCount: number;
  highScore?: number;
  createdAt?: string;
  isCustom?: boolean;
  gameType: "redstone" | "pcbuilder" | "aim" | "math" | "hero_quiz" | "custom_quiz";
  customData?: {
    instructions?: string;
    questions?: AiGameQuestion[];
  };
}
