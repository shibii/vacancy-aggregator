Vacancy aggregator study project.

This project consists of parser/crawler that collects new job vacancy ads from multiple sources, rest-like api server that provides full-text-search for said ads and a frontend web client to browse them.

The client is made with React.

The parser uses puppetteer to collect new job vacancy ads and inserts them into postgres database.

The backend is a basic express web server and only serves the api calls. The api has a naive user authentication made with bcrypt and jsonwebtoken libraries. Text search uses postgres tsvector and tsquery types.

I have not included the config files that provide the specific job vacancy websites and the corresponding xpath selectors to crawl and parse them. The program does not function as is. The program is not intended for public use.
