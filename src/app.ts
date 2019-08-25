import fastify from 'fastify';
import { IncomingMessage, Server, ServerResponse } from 'http';

const server: fastify.FastifyInstance<Server, IncomingMessage, ServerResponse> = fastify({});

const port: number = Number(process.env.PORT || 3000);

server.get('/ping', (req, res) => {
   res.send({ message: 'pong' });
});

server.listen(port, (err, address) => {
   if (err) {
      console.log('err:', err);
      process.exit(1);
   }

   console.log(`listening on port ${address}`);
});