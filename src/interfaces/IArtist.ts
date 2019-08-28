import IImage from "./IImage";
import IFollowers from "./IFollowers";

export interface IArtistSimplified {
   external_urls: Object;
   href: string;
   id: string;
   name: string;
   type: 'artist';
   uri: string;
}

export interface IArtist extends IArtistSimplified {
   followers: IFollowers;
   genres: Array<string>;
   images: Array<IImage>;
   popularity: number;
}
