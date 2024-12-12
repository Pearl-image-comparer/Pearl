# Pearl Satellite Comparison

<!-- Table of Contents -->

## Table of Contents

- [Overview](#Overview)
- [Features](#Features)
- [Installation](#Installation)
- [Usage](#Usage)
- [Enviromental Variables](#Enviromental-Variables)
- [Technologies used](#Technologies-used)
- [License](#License)
- [Acknowledgments](#Acknowledgments)
- [Contact](#Contact)

<!-- /Table of Contents -->

## Overview

Pearl Satellite Comparison is a project designed to compare satellite imagery for environmental monitoring and ecosystem
protection. This repository contains the tools, and resources necessary to visualize, and compare past satellite images to support
ecosystem preservation efforts. The map view includes a layer displaying endangered species sightings, which retrieves data
about Finnish endangered species and preservation areas. Additionally, users can report incidents directly through the app, and
these reports are showcased on the map view.

## Features

Map: View map with a search option.

Satellite map layer: See wanted areas as they appear on satellite imagery.

Comparison Tools: Choose historical satellite images by dates and compare them side by side.

Report: Add reports on incidents and log them to the database.

API Integration: Utilize third-party APIs for additional data sources (e.g., endanngered species data).

## Installation

- Install Node (v20.x or newer)
- Install Git
- Install any code editor
- Install Docker

### Steps

> `git clone https://github.com/Pearl-image-comparer/Pearl.git`

Navigate to the project directory:

> `cd pearl`

Install dependencies

> `npm install `

Create .env file to the project root and add all the required variables (see [wiki](https://github.com/Pearl-image-comparer/Pearl/wiki) for more information)

Start the project

> `npm run dev `

## Usage

Search locations on the map
Open the satellite view by choosing a date of imagery
Add another date to start the comparison
Toggle additional layers on and off for additional information on the area.

## Enviromental Variables

The `.env` file should include all of the below variables so make sure to add them before running the code

| Variable                 | Description                                                                      |
| ------------------------ | -------------------------------------------------------------------------------- |
| `COPERNICUS_INSTANCE_ID` | `<COPERNICUS-API-KEY>`                                                           |
| `LAJI_ACCESS_TOKEN`      | `<LAJITIETOKES-API-KEY>`                                                         |
| `POSTGRES_URI`           | `postgres://<USER>:<PASSWORD>@<ADDRESS>:5432/<DATABASE>`                         |
| `S3_REGION`              | `<S3-AREA>`                                                                      |
| `S3_ENDPOINT`            | `<S3-ADDRESS>`                                                                   |
| `S3_BUCKET`              | `<S3-BUCKET>`                                                                    |
| `S3_ACCESS_KEY_ID`       | `<ADDITIONAL-S3-KEY-ID>`                                                         |
| `S3_ACCESS_KEY`          | `<ADDITIONAL-S3-KEY-SECRET>`                                                     |
| `MEMCACHE_HOST`          | `<MEMCACHED-ADDRESS>`                                                            |
| `ADMIN_PASSWORD`         | `\$argon2id\$v=19\$m=65536,t=3,p=4\$<ADMIN-PASSWORD-SALT>\$<ADMIN-PASSWORD-KEY>` |
| `COOKIE_SECRET`          | `<RANDOM-PASSWORD-COOKIE-ENCRYPTION>`                                            |

## Technologies used

Frontend: Leaflet, Material UI<br>
backend: Remix, AWS S3 Bucket<br>
database: PostgreSQL<br>
APIs: laji.fi API, copernicus API, SYKE API<br>

## License

This project is licensed under the [MIT License](/LICENSE)

## Acknowledgments

[laji.fi API](https://laji.fi/about/3120) for endagenred species sightings
[Copernicus API](https://dataspace.copernicus.eu/analyse/apis) for satellite imagery
[Finnihs enviromental institute](https://www.syke.fi/fi-fi/avoin_tieto/avoimet_rajapinnat) for protected areas data

## Contact

Feel free to contact team for further information

Frontend / Design: Noora Vainionpää noora.t.vainionpaa@tuni.fi<br>
Frontend / Design: Teemu Tontti teemu.tontti@tuni.fi<br>
Backend / Technical review: Jarkko Kuukkanen jarkko.kuukkanen@tuni.fi<br>
Backend: Joonas Riivari joonas.riivari@tuni.fi<br>
