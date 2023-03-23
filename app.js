const express = require("express");
const { Client } = require("pg");
const app = express();
const port = 5000;

app.use((req, res, next) => {
	const client = new Client({
		user: "postgres",
		host: "localhost",
		database: "sugarprice",
		password: "denis123",
		port: 5432,
	});
	client.connect();
	req.db = client;
	next();
});

app.get("/prices", async (req, res) => {
	try {
		const result = await req.db.query("SELECT * FROM sugar_prices");
		res.json(result.rows);
	} catch (error) {
		console.error(error);
		res.status(500).send("Server error");
	}
});

app.get("/prices/:country", async (req, res) => {
	const { country } = req.params;

	try {
		const result = await req.db.query(
			"SELECT * FROM sugar_prices WHERE country = $1 ORDER BY date DESC LIMIT 1",
			[country]
		);

		if (result.rows.length === 0) {
			res.status(404).send(`No sugar prices found for ${country}`);
		} else {
			res.json(result.rows[0]);
		}
	} catch (error) {
		console.error(error);
		res.status(500).send("Server error");
	}
});

app.listen(port, () => {
	console.log(`Server listening to ${port}`);
});
