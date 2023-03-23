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

app.listen(port, () => {
	console.log(`Server listening to ${port}`);
});
