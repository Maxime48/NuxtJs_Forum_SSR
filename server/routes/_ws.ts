let peers: any[] = [];

export default defineWebSocketHandler({
    open(peer) {
        console.log("[ws] open", peer);
        peers.push({ peer, page: '' });
    },
    message(peer, message) {
        console.log("[ws] message", peer, message);
        const data = JSON.parse(message.text());
        if (data.type === 'page') {
            const peerIndex = peers.findIndex(p => p.peer === peer);
            if (peerIndex !== -1) {
                peers[peerIndex].page = data.page;
            }
        } else if (data.type === 'newMessage' || data.type === 'newSubject') {
            broadcast(data);
        }
    },
    close(peer, event) {
        console.log("[ws] close", peer, event);
        peers = peers.filter(p => p.peer !== peer);
    },
    error(peer, error) {
        console.log("[ws] error", peer, error);
    },
});

function broadcast(message: any) {
    peers.forEach(({ peer, page }) => {
        //console debug for all value
        console.log('peer ', peer);
        console.log('page ', page);
        console.log('message ', message);
        if (
            (message.type === 'newMessage' &&
                (
                    page === 'subject' ||
                    page === 'forum'
                )
            ) ||
            (message.type === 'newSubject' && page === 'forum')
        ) {
            peer.send(JSON.stringify(message));
            console.log('sent ', message);
        }
    });
}