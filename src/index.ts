import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cors from "cors";
import { router } from "./router/route";
import { Server } from "socket.io";
import { client } from "./helpers/socket";
const app = express();

app.use(
	cors({
		origin: "*",
		methods: ["GET", "POST", "PUT", "DELETE"],
	})
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: "*",
	},
});
client.on("loading_screen", (percent) => {
	io.emit("loading_screen", percent);
});

client.on("ready", () => {
	io.emit("server_ready", "Server Ready");
});

client.on("authenticated", (session) => {
	io.emit("authenticated", session);
});

client.on("message", async (msg) => {
	io.emit("message", msg);

	if (msg.body === "!server") {
		msg.reply("Server Ruedy, Sok Pakai Sesuai Jumlah Request Anda");
		io.emit("pesan-bot-!server", 1);
	} else if (msg.hasMedia) {
		const media = await msg.downloadMedia();
		io.emit("message", media);
	}
});

client.on("disconnected", (reason) => {
	io.emit("disconnectedUser", reason);
});

app.use(router);
app.set("io", io);
server.listen(3000, () => {
	console.log("Server started on http://localhost:3000");
});
