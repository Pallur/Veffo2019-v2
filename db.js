const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL; // sótt úr env gegnum dotenv pakka

const client = new Client({
  connectionString,
});

async function insert(name, email, phone, text, job, processed) {
  client.connect();
  try {
    const query = 'INSERT INTO applications (name, email, phone, text, job, processed) VALUES ($1, $2, $3, $4, $5, $6)';
    const res = await client.query(query, [name, email, phone, text, job, processed]);
    console.log(res.rows); // eslint-disable-line
  } catch (err) {
    throw err;
  }
  await client.end;
}

module.exports = {
  insert,
};
