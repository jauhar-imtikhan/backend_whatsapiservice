import whatsapp from "whatsapp-web.js";
const { Client, LocalAuth, MessageMedia } = whatsapp;
const client = new Client({
	authStrategy: new LocalAuth(),
	puppeteer: {
		headless: true,
	},
});
client.initialize();

export { client, MessageMedia };
