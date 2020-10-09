Vacancy aggregator study project.

This project consists of a parser/crawler that collects new job vacancy ads from multiple sources, rest-like api server that provides full-text-search for said ads and a couple of simple frontend web clients to browse them.

The clients are on their own repositories:
https://github.com/shibii/va-client-react.git
https://github.com/shibii/va-client-svelte.git

The parser/crawler uses puppetteer to collect new job vacancy ads and inserts them into postgres database.

The backend is a basic express web server and only serves the api calls. The api supports user accounts and implements a naive user authentication made with bcrypt and jsonwebtoken libraries. Users can hide and pin vacancy ads from search results page. Text search uses postgres tsvector and tsquery types.

Note that the program does not function as is. I have not included the website configs with the corresponding xpath selectors to crawl and parse them. Dotenv environment variable files are not included. Both the parser and the api backend require prepared postgres database to function. The program is not intended for public use.
