import IExternalUrl from "./IExternalUrl";
import IFollowers from "./IFollowers";
import IImage from "./IImage";

export default interface IUser {
   display_name: string;
   external_urls: IExternalUrl;
   followers: IFollowers;
   href: string;
   id: string;
   images: Array<IImage>;
   type: string;
   uri: string;
}

export interface IUserPrivate {
   country: string;
   email?: string;
   product: string;
}
