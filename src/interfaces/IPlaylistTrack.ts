import ITrack from "./ITrack";
import IUser from "./IUser";

export default interface IPlaylistTrack {
   added_at: string;
   added_by: IUser;
   is_local: boolean;
   track: ITrack;
}

