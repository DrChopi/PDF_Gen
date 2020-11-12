import sha512 from "js-sha512"
import jwt from "jsonwebtoken"
import val from "../modules/validator.module"

const rng = ( min, max ) => ( Math.floor(Math.random() * max * 1000)%max ) + min,
tkgen = (len) => { 
    let alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
        str   = ""
    for ( let i = 0 ; i < len ; i++ )
        str += alpha[rng(0, alpha.length)]
    return str
}

export default {
    post : async ( req, res, db ) => {
        try {
            if (val.mail(req.body.mail) && (await db.get("user",  { mail : req.body.mail }, 0)).length < 1) {
                req.body.rank = 0
                req.body.pass = sha512(req.body.pass)
                req.body.secret = tkgen(64)

                db.push("user", req.body)
            } else throw new Error("Already exist !")
            res.cookie("Authorize", "Bearer " + jwt.sign( { name : req.body.name, rank : 0, mail : req.body.mail }, req.body.secret )).sendStatus(201)
        } catch ( err ) {
            console.error(err)
            res.sendStatus(406)
        }
    }
}