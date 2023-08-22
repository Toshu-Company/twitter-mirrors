export interface VideoDetail {
  data: Data;
  includes: Includes;
  url: ArrayLikeObject<string>;
  video: ArrayLikeObject<string>;
  thumbnails: ArrayLikeObject<URL_TYPE>;
  uploader: string;
  uploader_id: string;
  uploader_url: string;
  webpage_url: string;
  title: string;
  formats: ArrayLikeObject<URL_TYPE>;
}

export interface Data {
  text: string;
  author_id: string;
  id: string;
  edit_history_tweet_ids: string[];
  attachments: Attachments;
}

export interface Attachments {
  media_keys: string[];
}

export interface Includes {
  media: Medum[];
  users: User[];
}

export interface Medum {
  media_key: string;
  preview_image_url: string;
  type: string;
  variants: Variant[];
}

export interface Variant {
  bit_rate?: number;
  content_type: string;
  url: string;
}

export interface User {
  username: string;
  name: string;
  id: string;
}

export interface URL_TYPE {
  url: string;
}

export type ArrayLikeObject<T> = {
  [key in string]: T;
};
