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
