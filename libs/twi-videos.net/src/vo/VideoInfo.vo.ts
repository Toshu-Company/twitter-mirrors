export interface VideoInfo {
  id: string;
  user: VideoInfoUser;
  tweet: string;
  title: string;
  thumbnail: string;
  video: string;
}

export interface VideoInfoUser {
  //   id: string;
  name: string;
  screen_name: string;
  profile_url: string;
}
