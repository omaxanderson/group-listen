import IImage from "./IImage";
import IRestrictions from "./IRestrictions";
import {IArtist, IArtistSimplified} from "./IArtist";
import ICopyright from "./ICopyright";
import IExternalId from "./IExternalId";

type IAlbumType = 'album' | 'single' | 'compilation';

export interface IAlbumSimplified {
   album_group?: IAlbumType | "appears_on";
   album_type: IAlbumType;
   artists: Array<IArtistSimplified>;
   available_markets: Array<string>;
   external_urls: Array<Object>;
   href: string;
   id: string;
   images: Array<IImage>;
   name: string;
   release_date: string;
   release_date_precision: string;
   restrictions: IRestrictions;
   type: string;
   uri: string;
}

export interface IAlbum extends IAlbumSimplified {
   copyrights: Array<ICopyright>;
   external_ids: IExternalId;
   genres: Array<string>;
   href: string;
   label: string;
   popularity: number;
   // @TODO swap for simplified track objects inside paging object
   tracks: Array<Object>;
};
