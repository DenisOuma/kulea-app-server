const express = require("express");
const { Client } = require("pg");
const app = express();
const port = 5000;

const client = new Client({
	user: "postgres",
	host: "localhost",
	database: "sugarprice",
	password: "denis123",
	port: 5432,
});

app.get("/prices", async (req, res) => {
	try {
		await client.connect();

		const query = {
			text: "SELECT sugar_name, country, date, price FROM sugar_prices WHERE date = (SELECT MAX(date) FROM sugar_prices)",
		};
		const result = await client.query(query);

		res.json(result.rows);
	} catch (err) {
		console.error(err);
		res.status(500).send("Internal server error");
	} finally {
		await client.end();
	}
});

app.get("/prices/:country", async (req, res) => {
	try {
		await client.connect();

		const query = {
			text: "SELECT sugar_name, country, date, price FROM sugar_prices WHERE country = $1 AND date = (SELECT MAX(date) FROM sugar_prices WHERE country = $1)",
			values: [req.params.country],
		};
		const result = await client.query(query);

		if (result.rows.length === 0) {
			res.status(404).send("Country not found");
		} else {
			res.json(result.rows);
		}
	} catch (err) {
		console.error(err);
		res.status(500).send("Internal server error");
	} finally {
		await client.end();
	}
});

app.listen(port, () => {
	console.log(`Server listening to ${port}`);
});
