import { db } from "../helpers";
const getUserByToken = (token: string, callback: any) => {
	db.query(
		`SELECT * FROM tbl_users JOIN tbl_detail_user ON tbl_users.user_id = tbl_detail_user.detail_user_id WHERE token_api = '${token}'`,
		(err: any, result: any) => {
			if (err) {
				return callback(err, "Something went wrong");
			} else {
				return callback(null, result);
			}
		}
	);
};

const createSessionUser = (id: string, data: any, callback: any) => {
	db.query(
		`INSERT INTO tbl_session_whatsapi (session_user_id, session_data) VALUES ('${id}','${data}')`,
		(err: any, result: any) => {
			if (err) {
				return callback(err, "Something went wrong");
			} else {
				return callback(null, result);
			}
		}
	);
};

const getSessionWhatsapi = (id: string, callback: any) => {
	db.query(
		`SELECT * FROM tbl_session_whatsapi WHERE session_user_id = '${id}'`,
		(err: any, result: any) => {
			if (err) {
				return callback(err, "Something went wrong");
			} else {
				return callback(null, result);
			}
		}
	);
};

const updateRequestUser = (id: string, request: any, callback: any) => {
	db.query(
		`UPDATE tbl_detail_user SET last_request = '${request}' WHERE detail_user_id = '${id}'`,
		(err: any, result: any) => {
			if (err) {
				return callback(err, "Something went wrong");
			} else {
				return callback(null, result);
			}
		}
	);
};

export {
	getUserByToken,
	createSessionUser,
	getSessionWhatsapi,
	updateRequestUser,
};
