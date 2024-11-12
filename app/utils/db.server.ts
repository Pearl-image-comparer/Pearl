import pg from "pg";

const client = new pg.Client(process.env.POSTGRES_URI);

async function init() {
  await client.connect();
  console.log("Successfully connected to database");

  // Create observations table.
  await client.query(`CREATE TABLE IF NOT EXISTS observations (
    id BIGSERIAL NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    location POINT NOT NULL,
    picture VARCHAR(255),
    date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
  )`);
}

// Make sure database connection is initialized.
await init();

export default client;
