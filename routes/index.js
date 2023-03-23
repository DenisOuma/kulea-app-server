const express = require("express");
const { Client } = require("pg");

const router = express.Router();

const client = new Client({
	user: "postgres",
	host: "localhost",
	database: "sugarprice",
	password: "denis123",
	port: 5432,
});

client.connect();

router.get("/sugar-prices", async (req, res) => {
	try {
		const result = await client.query("SELECT * FROM sugar_prices");
		res.status(200).json(result.rows);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Internal server error" });
	}
});

module.exports = router;
