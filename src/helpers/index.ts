const mysql = require("mysql");

export const db = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "",
	database: "db_whapi",
});

db.connect((err: any) => {
	if (err) {
		throw err;
	}
	console.log("Database connected");
});
