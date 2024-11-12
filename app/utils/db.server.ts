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

export interface Observation {
  id: number;
  title: string;
  description: string;
  location: { x: number; y: number };
  picture: string | null;
  date: Date;
}

export async function getObservations(): Promise<Observation[]> {
  const { rows } = await client.query("SELECT * FROM observations");
  // Map IDs from strings to numbers.
  return rows.map((row) => ({
    ...row,
    id: Number(row.id),
  }));
}
