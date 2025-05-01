import jwt from "jsonwebtoken";
const Secret_KEY = 'Alish';

 export default function auth(req,res,next){
    const token = req.headers.authorization;
    if(token){
   jwt.verify(token,Secret_KEY,function(err,decoded){
    if(err){
        res.status(401).send({
            message:"unauthorized"
        })
        
    }else{
        req.user = decoded;
        next();
    }
    });}
    else{
        res.send(401).send({
            message:"unauthorized"
        })
    }
}
