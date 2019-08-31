import {
    getRepository,
    getMongoManager,
    Connection,
    createConnection
} from 'typeorm';
import Party from '../entity/Party';
import * as controller from '../classes/PartyController';
import Queue from "../entity/Queue";

interface ICreatePartyParams {
    name: string;
    // later we're definitely going to want to add things here like basic setup settings
}

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
        try {
            return await controller.addMemberToParty({id, name});
        } catch (e) {
            res.code(500);
            return { success: false, message: e.message };
        }
    });

    fastify.delete('/:id/members', async (req, res) => {
        const { id } = req.params;
        const { name } = req.query;
        if (!name) {
            res.code(400);
            return { error: 'Name paramater required' };
        }
        try {
          return await controller.deleteMemberFromParty({
              id,
              name,
          });
        } catch (e) {
            res.code(500);
            return { success: false, message: e.message };
        }
    });

    fastify.post('/:id/queue', async (req, res) => {
        const { id } = req.params;
        const { song, songs, allowDups } = req.body;
        if (!song && !songs) {
            res.code(400);
            return { message: 'Song or songs required' };
        }
        try {
            if (song) {
                return await controller.addSongToQueue({ id, song, allowDups, })
            } else {
                return await controller.addSongsToQueue({ id, songs, allowDups, })
            }
        } catch (e) {
            console.log(e.message);
            res.code(400);
            return { success: false, message: e.message}
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
        try {
            return await controller.resetQueue({ id });
        } catch (e) {
            res.code(400);
            return { message: e.message}
        }
    });

    fastify.post('/:id/play', async (req, res) => {
        // play the queue
    });
}
