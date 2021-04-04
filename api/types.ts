export type ResponseMessage = {
  endpoint: string;
  status: number;
  message: string;
  size: number;
  data?: any;
};

export type SearchRequestor = {
  tag: string;
  id: string;
  plays?: number;
};

export type SearchObject = {
  requestor: SearchRequestor;
  title: string;
  date: string;
  plays?: number;
};

export type Song = {
  title: string;
  url: string;
  seconds: number;
  thumbnail: string;
  plays?: number;
};

export type JuanitaStats = {
  song_amount: number;
  search_amount: number;
  alias_amount: number;
  requestor_amount: number;
  song_of_the_day: Song;
  song_of_the_week: Song;
  song_of_the_month: Song;
  playtime: { seconds: number; readable: string };
};
