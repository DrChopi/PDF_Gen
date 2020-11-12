import jwt from "jsonwebtoken"
import val from "../modules/validator.module"

async function valJWT ( tok, db ) {
    try {
        let token = ( tok.split(' ') )[1].split('.')[1],
                    data = JSON.parse(Buffer.from(token, 'base64').toString())
    
        if ( val.mail(data.mail) && data.rank > 0 ) {
            let usr = await db.get("user", { mail : data.mail }, 0)
            jwt.verify(tok.split(' ')[1], usr[0].secret, (err, user) => {
                if (err) throw new Error(err);
            }) ; return true
        } else return false
    } catch (e) {
        return false
    }
}

export default {
    get : async (req, res, db) => {
        try {
            if ( !valJWT(req.cookies.Authorize, db) ) throw new Error('Unauthorized !');
            
            let page = +req.path.split('/')[2]
            res.send(db.find("template", typeof page != Number ? 0 : page * 10 ))
        } catch ( err ) {
            console.error(err)
            res.sendStatus(403)
        }
    },
    post : async (req, res, db) => {
        try {
            if ( !valJWT(req.cookies.Authorize, db) ) throw new Error('Unauthorized !');
            
            req.body.variable = JSON.parse(req.body.variable)
            for ( let i = 0 ; i < req.body.variable.length ; i++ )
            if ( typeof req.body.variable[i] != 'string' )
            throw new Error('Bad request !');

            db.push("template", req.body)
            res.sendStatus(201)
        } catch ( err ) {
            console.error(err)
            res.sendStatus(403)
        }
    }
}