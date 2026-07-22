export type DeepDivePrompt = {
  number: number;
  title: string;
  content: string;
  category?: string;
};

export type Flashcard = {
  question: string;
  answer: string;
};

export type ProcessResponse = {
  success: boolean;
  fromCache: boolean;
  videoId: string;
  videoUrl: string;
  title: string;
  description?: string;
  thumbnail?: string;
  author?: string;
  lengthSeconds?: number;

  summary: string;
  deepDivePrompts: DeepDivePrompt[];
  flashcards: Flashcard[];
  error?: string;
};
