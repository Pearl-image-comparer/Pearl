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

export interface Location {
  x: number;
  y: number;
}

export interface Observation {
  id: number;
  title: string;
  description: string;
  location: Location;
  picture: string | null;
  date: Date;
}

export async function getObservations(area?: {
  topLeft: Location;
  bottomRight: Location;
}): Promise<Observation[]> {
  const { rows } = area
    ? await client.query(
        `SELECT * FROM
          observations
        WHERE
          location[0] BETWEEN $1 AND $3 AND
          location[1] BETWEEN $2 AND $4`,
        [
          area.topLeft.x,
          area.topLeft.y,
          area.bottomRight.x,
          area.bottomRight.y,
        ],
      )
    : await client.query("SELECT * FROM observations");
  // Map IDs from strings to numbers.
  return rows.map((row) => ({
    ...row,
    id: Number(row.id),
  }));
}

export async function createObservation(
  title: string,
  description: string,
  location: Location,
  picture: string | null = null,
) {
  const { rows } = await client.query(
    `INSERT INTO observations
      (title, description, location, picture)
    VALUES
      ($1, $2, POINT($3,$4), $5)
    RETURNING id`,
    [title, description, location.x, location.y, picture],
  );
  return Number(rows[0].id);
}
