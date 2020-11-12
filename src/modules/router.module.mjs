import fs  from 'fs'
import vld from './validator.module'
import db from './mongo.module'

export default class Router {
    constructor() { this.dbs = null }
  
    async make (app, shm) {
      this.dbs = new db(shm)
      await this.dbs.init()
      await this.init(app)
    }
  
    async init (app) {
      let routes = await new Promise((resolve, reject) => fs.readdir('./src/routes', (err, res) => { if (err !== null) reject(err); resolve(res) }))
      if (routes.length > 0)
        this.prepare(app, routes)
      else console.error("ERROR : Empty /routes directory, please provide at least one route before lauching this API.");
    }
  
    async prepare (app, routes) {
      let lvCheck = this.lvCheck,
          dbs = this.dbs
  
      app.get('/', (req, res) => { res.redirect(301, "/api/v1") })
        
      for (let i = 0; i < routes.length; i++) {
        let route = ( await import('../routes/' + routes[i]) ).default
        for ( let j in route ) {
            app[j](('/' + routes[i].match(/[^\.]+/)[0] + '*'), async (req, res) => {
                try { route[j](req, res, this.dbs) }
                catch (e) { console.log(e); res.sendStatus(404) }
            }); console.log("Route " + j.toUpperCase() + '\t /' + routes[i].match(/[^\.]+/)[0] + " successfully initialized.")
        }
      }
    }
  }
  