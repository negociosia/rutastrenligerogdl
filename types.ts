
export interface Station {
  id: string;
  name: string;
  lat: number;
  lng: number;
  line: number | string;
  isTransfer?: boolean;
  transferLines?: (number | string)[];
  description?: string;
}

export interface LinePath {
  id: number | string;
  color: string;
  name: string;
  coordinates: [number, number][];
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
