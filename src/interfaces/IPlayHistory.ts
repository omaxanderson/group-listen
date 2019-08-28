import {ITrackSimplified} from "./ITrack";
import IContext from "./IContext";

export default interface IPlayHistory {
   track: ITrackSimplified;
   played_at: string;
   context: IContext;
}
