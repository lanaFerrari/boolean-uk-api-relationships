# boolean-uk-api-relationships

Today's exercise: Relationships with Prisma

Repo: boolean-uk-api-relationships

Description
Build CRUD in the controllers and practice writing Prisma queries that involve relationships between models

Instructions
- Setup Express and Prisma
- Setup your .env with the correct urls
- Build the models for User, Address and Order . 
- Build the controllers for  User, Address and Order

Build the models with the following attributes:

User:
- id
- email
- firstName
- lastName

Address:
- id
- street
- city
- postCode

Order:
- id
- createdAt (DateTime with @default(now())) 

And create these relationships:

- A user has one address : An address belongs to a user
- A user has many orders : An order belongs to a user

Use npx prisma studio to add some mock data to your models using "Add Record".

Build these routes and controllers for the users resource that work with the following fetch requests:
 - /users returns all users
 - /users/:id returns a specific user
 - /users/:id/address returns a specific user with an address
 - /users/:id/orders returns a specific user with a list of orders
 - /users/:id/orders?before=specific-time returns a specific user with a list of orders created before a specific time
 - /users?city=specific-city returns a list of users from a specific city

Tips
- Check the SQL after every request to see what's happening under the hood
- Use the prisma documentation
//////


Install Express and Prisma

Inside your project folder.

Run the following commands in the terminal:
- npm init -y
- npm i express morgan cors dotenv
- npm i -D nodemon prisma
- mkdir src
- touch src/index.js
- touch .env
- touch .gitignore

Inside .env
NODE_ENV="development"
PORT=3030

DATABASE_URL="postgres://your-databaase-url-here?schema=exercise-name"
SHADOW_DATABASE_URL="postgres://your-shadow-database-url-here?schema=shadow"


Inside .gitignore
node_modules
.env


Inside package.json (replace "scripts")
"scripts": {
  "start": "nodemon src/index.js"
},


Setup Express

Inside src/index.js
require("dotenv").config()

const express = require("express")
const cors = require("cors")
const morgan = require("morgan")

const app = express()

/* SETUP MIDDLEWARE */

app.disable("x-powered-by")

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan("dev"))

/* SETUP ROUTES */

app.get("*", (req, res) => {
  res.json({ ok: true })
})

/* START SERVER */

const port = process.env.PORT || 3030

app.listen(port, () => {
  console.log(`\n🚀 Server is running on http://localhost:${port}/\n`)
})


Run the following command in the terminal:

npm start
@here

Setup Prisma

Run the following command in the terminal:

npx prisma init

The above command will create a prisma folder and a schema.prisma file.

Inside prisma/schema.prisma (add shadowDatabaseUrl and a model)
datasource db {
  provider          = "postgresql"
  url               = env("DATABASE_URL")
  shadowDatabaseUrl = env("SHADOW_DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
 id       Int        @id @default(autoincrement())
 email    String     @unique
}


Run the following commands in the terminal:
- npx prisma migrate dev --name init
- npm i @prisma/client
- touch prisma/seed.js
- mkdir src/utils
- touch src/utils/database.js

Inside package.json (add)
"prisma": {
  "seed": "node prisma/seed.js"
},


Inside prisma/seed.js
const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

async function seed() {
  const users = [
    {
      email: "mike@mail.com",
    },
    {
      email: "nathan@mail.com",
    },
  ]

  const userPromises = users.map(async user => {
    return await prisma.user.create({ data: user })
  })

  try {
    await Promise.all(userPromises)
  } catch (error) {
    console.error("[ERROR] Seeding user model: ", {
      code: error.code,
      error: error.message,
    })

    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

seed()


Inside src/utils/database.js
const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

module.exports = prisma


Seed your database

Run the following command in the temrinal:

npx prisma db seed
(OR npx prisma migrate dev --name init)

Prisma Studio

Run the following command in a new temrinal:

npx prisma studio


/////

Add this to database.js to see queries and params:

const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient({
  log: [
    {
      emit: "event",
      level: "query",
    },
  ],
})

prisma.$on("query", async event => {
  console.log({ event })
})

module.exports = prisma

Challenge
Add a Product model with an inventory model.
