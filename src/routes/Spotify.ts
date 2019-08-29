import SpotifyApi from '../spotify_api/api';

const api = new SpotifyApi();

export default async (fastify, opts) => {
    fastify.get('/search', api.search);
    fastify.get('/devices', api.getDevices);

}
