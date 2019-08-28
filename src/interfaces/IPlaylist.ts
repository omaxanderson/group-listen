import IUser from "./IUser";
import IImage from "./IImage";
import IExternalUrl from "./IExternalUrl";
import IFollowers from "./IFollowers";
import IPaging from "./IPagingObject";

export interface IPlaylistSimplified {
   collaborative: boolean;
   external_urls: IExternalUrl;
   href: string;
   id: string;
   images: Array<IImage>;
   name: string;
   owner: IUser;
   public: boolean | null;
   tracks: ISimplePlaylistTracks;
   type: string;
   uri: string;
}

// @TODO need this?
interface ISimplePlaylistTracks {
   href: string;
   total: number;
}

export default interface IPlaylist extends IPlaylistSimplified {
   description: string;
   followers: IFollowers;
   snapshot_id: string;
   tracks: IPaging;
}
