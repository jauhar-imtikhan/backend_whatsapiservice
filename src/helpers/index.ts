const mysql = require("mysql");

export const db = mysql.createConnection({
	host: "ftiunwaha.my.id",
	user: "imtikhan@jauhar.ftiunwaha.my.id",
	password: "Assword_123!",
	database: "db_whapi",
});

db.connect((err: any) => {
	if (err) {
		throw err;
	}
	console.log("Database connected");
});
