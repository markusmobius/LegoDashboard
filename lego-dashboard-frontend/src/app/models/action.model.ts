export interface Action {
  Description: string;
  coverage: number;
  Republican: number; // -1 to 1, where negative is Democrat
  agreement: [number, number, number]; // [supporting, non-supporting, neutral]
}

export interface Publisher {
  id: string;
  name: string;
  leaning: 'Republican' | 'Democrat';
}

export type PoliticalGroup = 'Republican' | 'Democrat' | 'All';

export interface FilterOptions {
  date?: string;
  publisher?: string;
  group?: PoliticalGroup;
}