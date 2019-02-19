# MTG-Cube Card Database Generator

This project creates a document-based, indexed json database containing minified Magic: the Gathering card information.

The database should be generated every time a new set is released.

Between releases, this data is considered static and a hash suffix helps browsers cache the cards and search indices for better performance and offline usage.

## Installation
Run `npm install` inside this directory.

## Generating the card database
This tool currently uses [mtgjson](https://mtgjson.com/) to generate the database.

It requires `AllCards.json` and `AllSets.json` in the `input` directory. Both can be downloaded from [mtgjson.com](https://mtgjson.com/). 

Once the input requirements are met, simply run `npm start`.

## Output
The `output` directory will contain the generated card database.
- `output/versions` contains the version hashes to be inserted into `src/environments/environment.ts` as `indexVersionHash` and `cardVersionHash` respectively
- `output/maps` contains the mappings for minified information to the full text value (e.g. the type string `instant` becomes the number `1`)
- `output/cards` contains all card data in a minified format. Each unique card data is stored against its hash and `output/cards/versions-{card-versions-hash}.json` stores a map of card ids (id = card name without any special characters, See `lib/get-card-name-id.js`)
- `output/indices` contains the indices used for card search across the application. The `output/indices/versions-{index-version-hash}.json` file is treated as an entry point and links to individual index files.

Copy or move the `output/cards` and `output/indices` directories into `/src/assets` for the application to gain access to the database files.
Copy or move the `output/maps` directory into `/src/app/shared/models/static` for the application to gain access.

Update the hashes in `/src/environments/environment.ts` with the ones in `output/versions.json`.

The services automatically pick those up and will use the new database.
