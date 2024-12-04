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
init();

export default client;

export interface Location {
  x: number;
  y: number;
}

/** A single observation. */
export interface Observation {
  id: number;
  title: string;
  description: string;
  /** Specific location where the observation was found on. */
  location: Location;
  /** Optional picture for the observation which refers to the S3 bucket. */
  picture: string | null;
  /** Date on which the observation was recorded on. */
  date: Date;
}

/**
 * Find observations in a given area.
 *
 * @param area The area from where to search for observations
 *
 * @returns All found observations
 */
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
    : // If no area was specified, search for all observations in the database.
      await client.query("SELECT * FROM observations");

  // Map IDs from strings to numbers.
  return rows.map((row) => ({
    ...row,
    id: Number(row.id),
  }));
}

/**
 * Create a new observation.
 *
 * @param title Observation title
 * @param description Observation description
 * @param location Coordinates for the observation
 * @param picture Optional picture key referring to the S3 bucket
 *
 * @returns The newly created observation
 */
export async function createObservation(
  title: string,
  description: string,
  location: Location,
  picture: string | null = null,
): Promise<Observation> {
  const { rows } = await client.query(
    `INSERT INTO observations
      (title, description, location, picture)
    VALUES
      ($1, $2, POINT($3,$4), $5)
    RETURNING id, date`,
    [title, description, location.x, location.y, picture],
  );

  return {
    id: Number(rows[0].id),
    title,
    description,
    location,
    picture,
    date: rows[0].date,
  };
}

/**
 * Delete the obervation with a given ID.
 *
 * @returns The deleted observation
 */
export async function deleteObservation(id: number): Promise<Observation> {
  const { rows } = await client.query(
    `DELETE FROM observations
    WHERE id = $1
    RETURNING title, description, location, picture, date`,
    [id],
  );

  return {
    id,
    title: rows[0].title,
    description: rows[0].description,
    location: rows[0].location,
    picture: rows[0].picture,
    date: rows[0].date,
  };
}
