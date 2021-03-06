# adammackintosh.net - Back-end Server
<img src="http://adammackintosh.net/adam-logo.png">

> Adam Mackintosh's API. Feel free to inspect.

## Install
``` bash
$ git clone https://github.com/agm1984/adammackintosh-dot-net-server.git
$ cd adammackintosh-dot-net-server
$ npm install
$ npm run start:local
```

## Environment Config
The API contains an example environment config which facilitates Neo4j and Mongo DB configurations and CORS.

Simply rename the file from `./env/config.example.js` to `./env/config.js` and change the database credentials.

### Polyglot Databases
> adammackintosh.net uses Polyglot Persistence because relying on one database to handle all storage and retrieval duties is not maximally efficient or scalable. Rather, multiple databases are used, each for the duties at which it excels.

#### Neo4j
Neo4j is used to handle connected data (related data), and meta data aggregations. You will see it used for data analysis tasks and for recommending related content, specific to each user. Neo4j must be installed and running.

See `./connectors`

#### MongoDB
Once MongoDB is installed and running, type `mongo` in your CLI and then type:
```
> use adammackintosh
> db.createUser(
    {
      user: "adammackintosh",
      pwd: "insertPasswordHere",
      roles: [ "readWrite", "dbAdmin" ]
    }
  )
```
See `./connectors`


## How to Add a New Feature

### Required Steps
1. Define Mongoose Model in `./models`
2. Define GraphQL TypeDef
3. Add queries/mutations to schema
4. Add resolvers
5. Define Joi field validation schema
6. Test queries/mutations in GraphiQL
7. Back-end is ready, proceed to Front-end

## Contact

### Email
adam@adammackintosh.net

### GitHub

Submit any questions as issues on GitHub: https://github.com/agm1984/adammackintosh-dot-net-server/issues