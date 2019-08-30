import {ITrackSimplified} from "./ITrack";

interface IRecommendationsSeed {
   afterFilteringSize: number;
   afterRelinkingSize: number;
   href: string;
   id: string;
   initialPoolSize: number;
   type: 'artist' | 'track' | 'genre';
}
export default interface IRecommendations {
   seeds: IRecommendationsSeed;
   tracks: ITrackSimplified;
}
