import "reflect-metadata";
import IUser from './interfaces/spotify/IUser';
import fastify from 'fastify';
import fastifySession from 'fastify-session';
import fastifyCookie from 'fastify-cookie';
import { IncomingMessage, Server, ServerResponse } from 'http';
import {
   getMongoRepository,
   getMongoManager,
   Connection,
   createConnection
} from 'typeorm';
import Queue from './entity/Queue';
import { promises } from 'fs';
import path from 'path';
import Api from './spotify_api/api';
import spotifyRoutes from './routes/Spotify';
import partyRoutes from './routes/Party';
import Party from "./entity/Party";

const MemoryStore = require('connect-mongo')(fastifySession);

(async () => {
   const server: fastify.FastifyInstance<Server, IncomingMessage, ServerResponse> = fastify({});

   const port: number = Number(process.env.PORT || 3000);
   const domain: string = process.env.ENVIRONMENT === 'production' ? 'something' : 'localhost';
   let connection: Connection;
   let client_id;
   let client_secret;

   try {
      client_id = await promises.readFile(path.join(__dirname, '../client_id.txt'), 'utf8');
      client_secret = await promises.readFile(path.join(__dirname, '../client_secret.txt'), 'utf8');
      client_id = client_id.replace(/\s/g, '');
      client_secret = client_secret.replace(/\s/g, '');
   } catch (e) {
      console.log(e);
      process.exit(1);
   }

   const api = new Api();

   server.register(fastifyCookie);
   server.register(fastifySession, {
      secret: 'e59a7b781745ac15455de026297f024742209f17',
      cookie: {
         secure: false,
         maxAge: 1000 * 60 * 60 * 6,
      },
      saveUninitialized: true,
      store: new MemoryStore({
         url: 'mongodb://localhost/group_listen',
      }),
   });


   // Register routes
   server.register(spotifyRoutes, { prefix: '/spotify' });
   server.register(partyRoutes, { prefix: '/party' });

   server.get('/ping', (req, res) => {
      let t: IUser;
      res.send({ message: 'max' });
   });

   server.get('/test', async (req, res) => {
      const queue = new Queue();
      queue.songs = ['song1', 'song2', 'Naeem'];
      const manager = getMongoManager();
      try {
         const result = await manager.save(queue);
         return result;
      } catch (e) {
         console.log(e);
         return e;
      }
   });

   server.get('/a', async (req, res) => {
      const { id = {} } = req.query;
      console.log(id);
      const manager = getMongoRepository(Queue);
      try {
         const result = await manager.find(id);
         return result;
      } catch (e) {
         return { err: 'bad', ...e };
      }
   });

   server.get('/access', (req, res) => {
      res.send({ access_token: req.session.access_token })
   });

   server.get('/login', (req, res) => {
      api.authorize(req, res, {
         client_id,
         client_secret,
         redirect_uri: `http://${domain}:${port}/authorize`,
         scopes: ['playlist-read-private', 'user-read-playback-state'],
      });
   });

   // Should only be called as the redirect uri from spotify login
   server.get('/authorize', async (req, res) => {
      const { code, state } = req.query;
      return await api.login(req, res, {
         client_id,
         client_secret,
         code,
         redirect_uri: `http://${domain}:${port}/authorize`,
      });
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
         /*
         "type": "mysql",
         "host": "localhost",
         "port": 3306,
         "username": "root",
         "password": "maxanderson1",
         "database": "group_listen",
         //"entities": [ "./entity/*.ts" ],
         "entities": [ Party, Queue, Song ],
        */

        "type": "mongodb",
        "host": "localhost",
        "port": 27017,
        "database": "group_listen",
        "useNewUrlParser": true,
        "entities": [ Queue, Party ],
      });
   }

   setup().then(start);
})();
