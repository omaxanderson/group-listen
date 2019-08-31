import SpotifyApi from '../spotify_api/api';

const api = new SpotifyApi();

export default async (fastify, opts) => {
    fastify.route({
        url: '/*',
        method: ['GET', 'POST', 'PUT'],
        handler: api.proxy,
    });
}
