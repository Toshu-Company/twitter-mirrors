export interface Result {
  tweets: SimpleTweet[];
  users: SimpleUser[];
  keywords: string[];
}

export interface SimpleTweet {
  id: string;
  thumbnail: string;
  url: string;
  type: 'image' | 'video';
}

export interface SimpleUser {
  id: string;
  tag: string;
  thumbnail: string;
  url: string;
}

export interface TweetDetail {
  title: string;
  video: string;
  image: string;
  user: string;
  user_recommend: SimpleTweet[];
  recommend: SimpleTweet[];
}
