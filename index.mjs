// Dependencies
import exp from 'express'
import htt from 'http'
import bdp from 'body-parser'
import cps from 'cookie-parser'
import jya from 'js-yaml'
import sui from 'swagger-ui-express'
import fs  from 'fs'
import dnv from 'dotenv'
import rt from './src/modules/router.module'

// Instance
const app = exp(),
      srv = htt.createServer(app),
      rtr = new rt()

// Config
dnv.config()
app.use(cps())
app.use(bdp.urlencoded({ extended: true }))
app.use(bdp.json())
app.use('/api/v1', sui.serve, sui.setup(jya.safeLoad(fs.readFileSync('./swagger.yaml', 'utf8')), { explorer: true }))
app.use((req, res, next) => {

  res.set('Access-Control-Allow-Origin', req.headers.origin + "")
  res.set('Access-Control-Allow-Methods', 'HEAD, GET, POST, PUT, PATCH, DELETE')
  res.set('Accept-Patch', 'true')
  res.set('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token, Set-Cookie')
  res.set('Access-Control-Allow-Credentials', 'true')

  next()
})

rtr.make(app, { //DATA_MODEL
  user : {
    rank : Number,
    name : String,
    mail : String,
    pass : String,
    secret : String
  },
  doc : {
    owner : String,
    created : Date,
    content : String
  },
  template : {
    title : String,
    created : Date,
    content : String,
    variable : [ String ]
  }
})

// Run
srv.listen(process.env.PORT, () => console.log("\nServer listen on port : " + process.env.PORT + "\n"))