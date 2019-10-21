// Kaya

const pg = require('pg');
const pool = new pg.Pool({
	user: 'postgres',
	host: '127.0.0.1',
	database: 'postgres',
	password: 'asdf',
	port: '5432'
});

function kaya(req, res) {
	pool.query("SELECT * FROM dummy;", (err,response) => {
		if (err) {
			res.send(":(");
		}
		else {
			res.send(JSON.stringify(response.rows));
			//pool.end();
		}
	});
}

module.exports = {
	kaya: kaya
};