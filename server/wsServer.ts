import { Server as WebSocketServer } from 'ws'; // Assurez-vous d'installer une bibliothèque WebSocket côté serveur

const wss = new WebSocketServer({ noServer: true });

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
    (req, res) => {
      res.statusCode = 200;
      res.end();
    },
    // Intégration WebSocket dans le serveur HTTP de Nuxt
    { path: '/_ws', handler: (_, upgradeReq, socket, head) => {
      wss.handleUpgrade(upgradeReq, socket, head, function done(ws) {
        wss.emit('connection', ws, upgradeReq);
      });
    }},
  ]
};
