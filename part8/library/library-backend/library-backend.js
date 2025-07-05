require('dotenv').config()
const jwt = require('jsonwebtoken')

const http = require('http')
const express = require('express')
const cors = require('cors')

const { ApolloServer } = require('@apollo/server')
const { expressMiddleware } = require('@as-integrations/express5')
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer')
const { ApolloServerPluginLandingPageLocalDefault } = require('@apollo/server/plugin/landingPage/default')
const { useServer } = require('graphql-ws/use/ws')

const { makeExecutableSchema } = require('@graphql-tools/schema')

const { WebSocketServer } = require('ws')

const mongoose = require('mongoose')

mongoose.set('strictQuery', false)
const User = require('./models/user.js')

const typeDefs = require('./schema.js') 
const resolvers = require('./resolvers.js') 

console.log('connecting to', process.env.MONGODB_URI)
mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log('connected to MongoDB')
}).catch((error) => {
  console.log('error connection to MongoDB:', error.message)
})

mongoose.set('debug', true); // debug the n+1 issue thats created on querying multiple items

const start = async () => {
  const app = express()
  app.use(cors())

  const httpServer = http.createServer(app)
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/',
  })
  
  const schema = makeExecutableSchema({ typeDefs, resolvers })
  const serverCleanup = useServer({ schema }, wsServer)

  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageLocalDefault(),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
    
  })

  await server.start()

  app.use(
    '/',
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const auth = req ? req.headers.authorization : null
        if (auth && auth.startsWith('Bearer ')) {
          const decodedToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET)
          const currentUser = await User.findById(decodedToken.id)
          return { currentUser }
        }
      },
    }),
  )

  const PORT = 4000

  httpServer.listen(PORT, () =>
    console.log(`Server is now running on http://localhost:${PORT}`)
  )
}

start()