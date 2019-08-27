import "reflect-metadata";
import fastify from 'fastify';
import { IncomingMessage, Server, ServerResponse } from 'http';
import { getMongoManager, Connection, createConnection } from 'typeorm';
import Queue from './entity/Queue';

const server: fastify.FastifyInstance<Server, IncomingMessage, ServerResponse> = fastify({});

const port: number = Number(process.env.PORT || 3000);
let connection: Connection;

server.get('/ping', (req, res) => {
   res.send({ message: 'max' });
});

server.get('/test', async (req, res) => {
   const queue = new Queue();
   queue.songs = ['song1', 'song2', 'Naeem'];
   const manager = getMongoManager();
   try {
      const result = await manager.save(queue);
      res.send(result);
   } catch (e) {
      console.log(e);
   }
});

const start = () => {
   server.listen(port, '0.0.0.0', (err, address) => {
      if (err) {
         console.log('err:', err);
         process.exit(1);
      }

      console.log(`listening on port ${address}`);
   });
}

const setup = async () => {
   connection = await createConnection({
      "type": "mongodb",
      "host": "localhost",
      "port": 27017,
      "database": "group_listen",
      "useNewUrlParser": true,
      "entities": [ Queue ],
   });
}

setup().then(start);
