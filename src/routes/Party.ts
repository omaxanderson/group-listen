import {
    getRepository,
    getMongoManager,
    Connection,
    createConnection
} from 'typeorm';
import Party from '../entity/Party';
import Queue from "../entity/Queue";

interface ICreatePartyParams {
    name: string;
    // later we're definitely going to want to add things here like basic setup settings
}

// const manager = getMongoManager();

export default async (fastify, opts) => {
    fastify.get('/:id', async (req, res) => {
        const manager = getMongoManager();
        return await manager.findOne(Party, req.params.id);
    });

    fastify.get('/', async (req, res) => {
        const { id = {}, name } = req.query;
        const manager = getMongoManager();
        try {
            let result;
            if (name) {
                result = await manager.findOne(Party, { where: { name } });
            } else {
                result = await manager.findOne(Party, id);
            }
            if (!result) {
                throw new Error(`Party name '${name}' not found`);
            }
            return result;
        } catch (e) {
            res.code(500);
            return { err: 'bad', message: e.message };
        }
    });

    fastify.post('/', async (req, res) => {
        const { name } = req.body;
        const party = new Party();
        party.name = name;
        const manager = getMongoManager();
        try {
            const result = await manager.save(party);
            return {
                url: `localhost:3000/party?id=${result.id}`,
                ...result,
            };
        } catch (e) {
            console.log('Error creating party: ', e.message);
            return e;
        }
    });

    fastify.post('/:id/members', async (req, res) => {
        const { id } = req.params;
        const { name } = req.query;
        if (!name) {
            res.code(400);
            return { error: 'Name paramater required' };
        }
        const manager = getRepository(Party);
        try {
            const party = await manager.findOne(req.params.id);
            const members = [...new Set([...party.members, name])];
            await manager.update(party.id.toString(), { members } );
            return await manager.findOne(req.params.id);
        } catch (e) {
            console.log(e.message);
            res.code(400);
            return { message: e.message}
        }
    });

    fastify.delete('/:id/members', async (req, res) => {
        const { id } = req.params;
        const { name } = req.query;
        if (!name) {
            res.code(400);
            return { error: 'Name paramater required' };
        }
        const manager = getRepository(Party);
        try {
            const party = await manager.findOne(id);
            const members = party.members.filter(m => m !== name);
            await manager.update(party.id.toString(), { members } );
            return await manager.findOne(id);
        } catch (e) {
            console.log(e.message);
            res.code(400);
            return { message: e.message}
        }
    });

    fastify.post('/:id/queue', async (req, res) => {
        const { id } = req.params;
        const { song, songs, allowDups } = req.body;
        if (!song && !songs) {
            res.code(400);
            return { message: 'Song or songs required' };
        }
        const manager = getRepository(Party);
        try {
            const { queue: oldQueue } = await manager.findOne(id);
            console.log('song', song);
            console.log('songs', songs);
            console.log('oldQueue', oldQueue);
            const allSongs = song
              ? [...oldQueue, song]
              : [...oldQueue, ...songs];
            console.log('allSongs', allSongs);

            const queue = allowDups
              ? allSongs
              : [...new Set(allSongs)];
            console.log(JSON.stringify('queue', queue));
            await manager.update(id, { queue });
            return await manager.findOne(id);
        } catch (e) {
            console.log(e.message);
            res.code(400);
            return { message: e.message}
        }
    });

    fastify.put('/:id', async (req, res) => {
        const { id } = req.params;
        const { name } = req.body;
        const manager = getRepository(Party);
        try {
            await manager.update(id, { name });
            return await manager.findOne(id);
        } catch (e) {
            console.log(e.message);
            res.code(400);
            return { message: e.message}
        }

    });

    // Delete queue
    fastify.post('/:id/queue/reset', async (req, res) => {
        const { id } = req.params;
        const manager = getRepository(Party);
        try {
            await manager.update(id, { queue: [] });
            return await manager.findOne(id);
        } catch (e) {
            console.log(e.message);
            res.code(400);
            return { message: e.message}
        }
    });
}
