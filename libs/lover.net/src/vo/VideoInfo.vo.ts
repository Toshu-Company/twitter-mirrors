export interface VideoInfo {
  id: string;
  title: string;
  video: string;
  category: Category;
}

export type Category = '한국야동' | '성인야동' | '레즈야동' | '게이야동';
