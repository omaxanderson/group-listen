import IExternalUrl from "./IExternalUrl";

export default interface ITrackLink {
   external_urls: IExternalUrl;
   href: string;
   id: string;
   type: 'track';
   uri: string;
}
