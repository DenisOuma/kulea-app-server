const express = require("express");
const { Client } = require("pg");

const axios = require("axios");
const cheerio = require("cheerio");
const routes = require("./routes/index");
const app = express();
const port = 5000;

const urls = [
	{ url: "https://www.jumia.co.ke/sugar/", country: "Kenya" },
	{ url: "https://www.jumia.ug/sugar/", country: "Uganda" },
	{ url: "https://www.jumia.com.ng/sugars/", country: "Nigeria" },
];

const client = new Client({
	user: "postgres",
	host: "localhost",
	database: "sugarprice",
	password: "denis123",
	port: 5432,
});

async function scrapeData() {
	try {
		await client.connect();

		for (const url of urls) {
			const response = await axios.get(url.url);
			const $ = cheerio.load(response.data);

			console.log(`Scraping data for ${url.country}`);

			const promises = [];

			$(".-paxs>article").each((index, sugar) => {
				const sugarName = $(sugar).find(".info h3").text().trim();
				const sugarPrice = $(sugar).find(".prc").text().trim();
				const numericPrice = parseFloat(sugarPrice.match(/\d+(\.\d+)?/)[0]);
				const currentDate = new Date().toISOString().slice(0, 10);

				const insertQuery = {
					text: "INSERT INTO sugar_prices (sugar_name, country, date, price) VALUES ($1, $2, $3, $4)",
					values: [sugarName, url.country, currentDate, numericPrice],
				};

				const promise = client.query(insertQuery);
				promises.push(promise);
			});

			await Promise.all(promises);
			console.log(`Data inserted successfully for ${url.country}`);
		}
	} catch (error) {
		console.error(error);
	} finally {
		await client.end();
	}
}

scrapeData().catch((error) => console.log(error));
