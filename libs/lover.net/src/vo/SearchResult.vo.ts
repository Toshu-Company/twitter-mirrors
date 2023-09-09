export interface SearchResult {
  videos: SearchResultVideo[];
  count: number;
}

export interface SearchResultVideo {
  id: string;
  title: string;
}

