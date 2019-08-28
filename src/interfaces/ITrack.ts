import {IArtistSimplified} from "./IArtist";
import IExternalUrl from "./IExternalUrl";
import IRestrictions from "./IRestrictions";
import {IAlbumSimplified} from "./IAlbum";
import IExternalId from "./IExternalId";
import ITrackLink from "./ITrackLink";

export interface ITrackSimplified {
   artists: Array<IArtistSimplified>;
   available_markets: Array<string>;
   disc_number: number;
   duration_ms: number;
   explicit: boolean;
   external_urls: IExternalUrl;
   href: string;
   id: string;
   is_playable: boolean;
   // @TODO linked track object?
   // https://developer.spotify.com/documentation/web-api/reference/object-model/#track-link
   linked_from: ITrackLink;
   restrictions: IRestrictions;
   name: string;
   preview_url: string;
   track_number: number;
   type: 'track';
   uri: string;
   is_local: boolean;
}

export default interface ITrack {
   album: IAlbumSimplified;
   external_ids: IExternalId;
   popularity: number;

}
