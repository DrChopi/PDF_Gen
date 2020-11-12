import sha512 from "js-sha512"
import jwt from "jsonwebtoken"
import val from "../modules/validator.module"

export default {
    post : async ( req, res, db ) => {
        try {
            if (val.mail(req.body.mail)) {
                let usr = await db.get("user", { mail : req.body.mail, pass : sha512(req.body.pass) }, 0)
                if ( usr.length > 0 )
                    res.cookie("Authorize", "Bearer " + jwt.sign( { name : usr[0].name, mail : usr[0].mail, rank : usr[0].rank }, usr[0].secret )).sendStatus(201)
                else
                    throw new Error("Bad username or password !")
            } else throw new Error("Bad request !")
        } catch ( err ) {
            console.error(err)
            res.sendStatus(406)
        }
    },
    head : async ( req, res, db ) => {
        try {
            let token = ( req.cookies.Authorize.split(' ') )[1].split('.')[1],
                data = JSON.parse(Buffer.from(token, 'base64').toString())

            if ( val.mail(data.mail) ) {
                let usr = await db.get("user", { mail : data.mail }, 0)
                jwt.verify(req.cookies.Authorize.split(' ')[1], usr[0].secret, (err, user) => {
                    if (err) throw new Error(err);
                    res.sendStatus(200)
                })
            } else throw new Error("Bad request !")
        } catch ( err ) {
            console.error(err)
            res.sendStatus(403)
        }
    }
}