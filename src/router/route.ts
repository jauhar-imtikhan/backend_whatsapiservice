import express from "express";
import { WaController } from "../controllers/WaController";
const router = express.Router();

router.get("/api/v1/qr", (req: express.Request, res: express.Response) => {
	WaController.GetQr(req, res, req.app.get("io"));
});

router.post(
	"/api/v1/send_message",
	(req: express.Request, res: express.Response) => {
		WaController.SendMessage(req, res);
	}
);
export { router };
