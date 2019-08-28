import ICursor from "./ICursor";

interface IPagingBase {
   href: string;
   // TODO create a type that consists
   // of the possible objects (albums, artists, tracks, etc)
   items: Array<Object>;
   limit: number;
   next: string;
   total: number;
}

export default interface IPaging extends IPagingBase {
   offset: number;
   previous: string;
}

export interface ICursorPaging extends IPagingBase {
   cursors: ICursor;
}
