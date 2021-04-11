const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const { readFileSync } = require('fs')

const graphQlHttp = require('express-graphql')
const { buildSchema } = require('graphql')

const app = express()
app.use(cors())
app.use(bodyParser.json())

// Here we define our graphql schema
const graphQlSchema = buildSchema(readFileSync('./graphql/schemas/index.graphql', { encoding:'utf-8' }))
// GraphQL root
const graphQlResolvers = require('./graphql/resolvers/rootResolvers.js')
// Auth Middleware
const { authMiddleware } = require('./middleware/authMiddleware.js')

app.use(authMiddleware)

// At this (custom) endpoint will work GraphQL
app.use('/graphql', graphQlHttp.graphqlHTTP({

    schema: graphQlSchema,
    // Resolver. It's like controller at REST API. When event is called, it emit actions
    rootValue: graphQlResolvers,
    // Special interface, where we can test our api
    graphiql: true,
}))


const PORT = process.env.PORT || 5000
mongoose
.connect('mongodb+srv://bl1nk:onefoot759@graphql-cluster.bxrfy.mongodb.net/events-graphql-dev?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true  })
.then( () => app.listen( PORT, () => console.log(`Listening on ${PORT}...`) ) )
.catch( (error) =>{
    console.log(error)
})

