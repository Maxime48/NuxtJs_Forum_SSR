<script setup>
let ws
const messages = ref([])

const connect = async () => {
  const isSecure = location.protocol === "https:";
  const url = (isSecure ? "wss://" : "ws://") + location.host + "/_ws";
  if (ws) {
    ws.close();
  }

  console.log("Connexion à", url, "...");
  ws = new WebSocket(url);
  ws.addEventListener("message", (event) => {
    const message = event.data
    console.log(message);
    messages.value.push(message)
  });

  await new Promise((resolve) => ws.addEventListener("open",
      resolve));
  console.log("ws connecté!");
};
const ping = () => {
  console.log("ws envoi ping");
  ws.send("ping");
};
</script>
<template>
  <div>Messages: {{ messages }}</div>
  <button @click="connect">Connecter</button>
  <button @click="ping">Ping</button>
</template>
