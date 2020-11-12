import mng from 'mongoose'


export default class Mongo {
    constructor (shm) {
        this.shm = shm
        this.scheme = {}
        this.conn = mng.connect(process.env.DB_STRING, { useNewUrlParser: true, useUnifiedTopology: true });
    }

    init () {
        return new Promise (res => {
            for ( let i in this.shm )
                this.scheme[i] = mng.model(i, new mng.Schema(this.shm[i]))
            res(true)
        })
    }

    get (model, filter, page) {
        return this.scheme[model].find(filter, null, { skip : page ? 0 : page })    
    }

    push (model, values) {
        console.log(this.scheme);
        this.scheme[model].create(values, (err, res) => { if (err) throw new Error(err); })
    }
}