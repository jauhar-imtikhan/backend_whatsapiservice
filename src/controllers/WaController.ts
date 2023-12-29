import express from "express";
import { client, MessageMedia } from "../helpers/socket";
import {
  createSessionUser,
  getSessionWhatsapi,
  getUserByToken,
  updateRequestUser,
} from "../db/user";
import { validationSendMessage } from "../helpers/validation";

const WaController = {
  GetQr: (req: express.Request, res: express.Response, io: any) => {
    const Auth = req.headers.authorization;
    if (!Auth) {
      res.status(401).json({ code: 401, message: "Unauthorized" });
    }
    try {
      getUserByToken(Auth, (err: any, result: any) => {
        if (err) throw err;
        if (Auth !== result[0].token_api) {
          throw res
            .status(401)
            .json({ code: 401, message: "Token is not valid" });
        }
        getSessionWhatsapi(result[0].user_id, (err: any, response: any) => {
          if (err) throw err;
          if (response.length > 0) {
            client.on("ready", () => {
              io.emit("server_ready", "Server Ready");
              res.status(200).json({
                code: 200,
                message: "Server Ready",
              });
            });
          } else {
            client.on("qr", (qr) => {
              io.emit("whatsappQr", qr);
              createSessionUser(
                result[0].user_id,
                qr,
                (err: any, result: any) => {}
              );
              res.status(200).json({ qr: qr });
            });
            res.status(400).json({
              code: 400,
              errors: {
                message:
                  "Device Tidak Ditemukan, Silahkan Scan QR Diatas. Mohon Tunggu Sebentar",
              },
            });
          }
        });
      });
    } catch (error) {
      res.status(400).json({
        code: 400,
        errors: error,
      });
    }
  },

  SendMessage: (req: express.Request, res: express.Response) => {
    const Auth = req.headers.authorization;
    const requestBody = {
      phone: req.body.phone,
      message: req.body.message,
      media: req.body.media,
    };
    if (!Auth) {
      res.status(401).json({ code: 401, message: "API Token Is Not Valid" });
    }
    try {
      getUserByToken(Auth, (err: any, result: any) => {
        if (err) {
          res.status(400).json({
            code: 400,
            errors: {
              message: err,
            },
          });
        }
        if (Auth !== result[0].token_api) {
          res.status(401).json({
            code: 401,
            message: "API Token Is Not Valid",
          });
        } else {
          if (result.length > 0) {
            validationSendMessage(
              requestBody,
              (err: any, res_Validation: any) => {
                if (err) {
                  res.status(400).json({
                    code: 400,
                    errors: {
                      message: err,
                    },
                  });
                } else {
                  if (res_Validation.phone.startsWith("0")) {
                    res_Validation.phone =
                      "62" + res_Validation.phone.slice(1) + "@c.us";
                  } else if (res_Validation.phone.startsWith("62")) {
                    res_Validation.phone = res_Validation.phone + "@c.us";
                  } else {
                    res_Validation.phone =
                      "62" + res_Validation.phone + "@c.us";
                  }
                  if (!requestBody.media) {
                    client
                      .sendMessage(res_Validation.phone, res_Validation.message)
                      .then(
                        (responseSuccess) => {
                          res.status(200).json({
                            code: 200,
                            message:
                              "Success Send Message To " + requestBody.phone,
                          });
                          try {
                            const last_req = result[0].last_request;
                            const user_id = result[0].detail_user_id;
                            updateRequestUser(
                              user_id,
                              last_req - 1,
                              (err: any, success: any) => {}
                            );
                          } catch (errorM) {
                            res.status(400).json({
                              code: 400,
                              errors: {
                                message: errorM,
                              },
                            });
                          }
                        },
                        (errSendMessage) => {
                          res.status(400).json({
                            code: 400,
                            errors: {
                              message:
                                "Failed Send Message To " + requestBody.phone,
                              error: errSendMessage,
                            },
                          });
                        }
                      );
                  } else {
                    const file = res_Validation.media;
                    const NewFile = file.replace("\\", "/");
                    const media = MessageMedia.fromFilePath(NewFile);
                    client.sendMessage(res_Validation.phone, media).then(
                      (responseSuccess) => {
                        res.status(200).json({
                          code: 200,
                          message:
                            "Success Send Message To " + requestBody.phone,
                        });
                      },
                      (errorMessage) => {
                        res.status(400).json({
                          code: 400,
                          errors: {
                            message:
                              "Failed Send Message To " + requestBody.phone,
                            error: errorMessage,
                          },
                        });
                      }
                    );
                  }
                }
              }
            );
          }
        }
      });
    } catch (error) {
      res.status(400).json({
        code: 400,
        errors: error,
      });
    }
  },

  Test: (req: express.Request, res: express.Response) => {
    res.status(200).json({
      code: 200,
      message: {
        phone: req.body.phone,
        message: req.body.message,
      },
    });
  },
};

export { WaController };
