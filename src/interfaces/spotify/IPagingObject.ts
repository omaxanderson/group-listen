import ICursor from "./ICursor";

interface IPagingBase<T> {
   href: string;
   // TODO create a type that consists
   // of the possible objects (albums, artists, tracks, etc)
   items: Array<T>;
   limit: number;
   next: string;
   total: number;
}

export default interface IPaging<T> extends IPagingBase<T> {
   offset: number;
   previous: string;
}

export interface ICursorPaging extends IPagingBase {
   cursors: ICursor;
}
