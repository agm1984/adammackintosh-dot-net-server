# adammackintosh.net - Back-end Server
<img src="http://adammackintosh.net/adam-logo.png">

> Adam Mackintosh's Portfolio API. Feel free to inspect.

This portfolio has been designed from the ground up to facilitate demonstration of skills and abilities, but it is also creatively expressed in doing so. There are two main types of viewer types of this portfolio. One, any person that may find themselves browsing it, and two, potential employers and clients. For these reasons, portfolio content delivery is aimed to be not only engaging and light in nature but also very objective and fact-based.


## Demonstrated Technologies
Stores

1. Neo4j
2. Mongo DB

Server

1. node.js
2. Express JS
3. GraphQL
4. Apollo Server
5. Joi Validation

Deployment

1. Jenkins CI


## Install
``` bash
$ git clone ...
$ cd portfolio
$ npm install
$ npm run start:local
```

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

I tried to make this portfolio as user-friendly and developer-friendly as possible, but if anything is unclear, please submit any questions as issues on GitHub: https://github.com/agm1984/adammackintosh-dot-net-server/issues