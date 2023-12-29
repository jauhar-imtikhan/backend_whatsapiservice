import whatsapp from "whatsapp-web.js";
const { Client, LocalAuth, MessageMedia } = whatsapp;
const client = new Client({
	authStrategy: new LocalAuth(),
	puppeteer: {
		headless: true,
		args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-extensions']
	},
});
client.initialize();

export { client, MessageMedia };
