import jwt from "jsonwebtoken"
import val from "../modules/validator.module"

async function valJWT ( tok, db ) {
    try {
        let token = ( tok.split(' ') )[1].split('.')[1],
                    data = JSON.parse(Buffer.from(token, 'base64').toString())
    
        if ( val.mail(data.mail) && data.rank >= 0 ) {
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
            let data = JSON.parse(Buffer.from(( req.cookies.Authorize.split(' ') )[1].split('.')[1], 'base64').toString()),
                usr = (await db.get("user", { mail : data.mail }, 0))[0]
            
            let page = req.path.split('/')
            switch ( page[2] ) {
                case "download" :
                    res.send(await db.get("doc", { _id : page[3] } )[0])
                    break;
                case "getTemplate" :
                    res.send(await db.get("template", { _id : page[3] } ))
                    break;
                case "listTemplate" :
                    res.send(await db.get("template", {}, typeof +page[3] != Number ? 0 : +page[3] * 10 ))
                    break;
                default :
                    res.send(await db.get("doc", { owner : usr._id }, typeof +page[2] != Number ? 0 : +page[2] * 10 ))
            }
        } catch ( err ) {
            console.error(err)
            res.sendStatus(403)
        }
    },
    post : async (req, res, db) => {
        try {
            if ( !valJWT(req.cookies.Authorize, db) ) throw new Error('Unauthorized !');
            let data = JSON.parse(Buffer.from(( req.cookies.Authorize.split(' ') )[1].split('.')[1], 'base64').toString()),
                usr = (await db.get("user", { mail : data.mail }, 0))[0],
                tmp = await db.get("template", { _id : req.body.id })
            
            req.body.variable = JSON.parse(req.body.variable)
            if ( !tmp[0] || req.body.variable.length != tmp[0].variable.length ) throw new Error("Bad request !");

            for ( let i = 0 ; i < tmp[0].variable.length ; i++ )
                tmp[0].content = tmp[0].content.replace("{{ " + tmp[0].variable[i] + " }}", req.body.variable[i])

            db.push("doc", { owner : usr._id, content : tmp[0].content })
            res.sendStatus(201)
        } catch ( err ) {
            console.error(err)
            res.sendStatus(403)
        }
    }
}