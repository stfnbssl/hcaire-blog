export type ContentAccessType = 'free' | 'plus';

export interface Content {
  _id: string;
  slug: string;
  titolo: string;
  descrizione: string;
  contenuto: string;
  autore: string;
  categoria: string;
  tags: string[];
  isPublished: boolean;
  isPinned: boolean;
  accessType: ContentAccessType;
  locked?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ContentListItem = Omit<Content, 'contenuto'>;

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ContentFormData {
  slug: string;
  titolo: string;
  descrizione: string;
  contenuto: string;
  autore: string;
  categoria: string;
  tags: string[];
  isPublished: boolean;
  isPinned: boolean;
  accessType: ContentAccessType;
}
