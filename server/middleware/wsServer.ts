import { IncomingMessage } from "http";
import { Duplex } from "stream";
import {WebSocketServer} from "ws";


const wss = new WebSocketServer({noServer: true});

wss.on('connection', function connection(ws) {
  console.log('Une connexion WebSocket est établie.');

  ws.on('message', function incoming(message) {
    console.log('Reçu : %s', message);

    // Envoyer un message à tous les clients connectés
    wss.clients.forEach(function each(client) {
      if (client.readyState === ws.OPEN) {
        client.send(message);
      }
    });
  });
});

export default {
  serverMiddleware: [
    (req: any, res: { statusCode: number; end: () => void; }) => {
      res.statusCode = 200;
      res.end();
    },
    // Intégration WebSocket dans le serveur HTTP de Nuxt
    {
      path: '/_ws', handler: (_: any, upgradeReq: IncomingMessage, socket: Duplex, head: Buffer) => {
      wss.handleUpgrade(upgradeReq, socket, head, function done(ws) {
        wss.emit('connection', ws, upgradeReq);
      });
    }},
  ]
};
