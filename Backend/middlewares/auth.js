const jwt = require('jwt-simple');
const moment = require('moment');

exports.authenticateToken = (request, response, next) =>{

    if(!request.headers.authorization){
        return response.status(401).json({mensaje: "La peticion no esta autorizada"})
    }

    let token = request.headers.authorization.replace(/['"]+/g, '');
    let payload;
    try{
        let payload = jwt.decode(token, process.env.SECRET);
        if(payload.exp <= moment().unix()){
            return response.status(401).json({mensaje: "El token ha expirado"})
        }
        
    } catch(error){
        return response.status(401).json({mensaje: "El token no es valido"})
    }

    request.user = payload;
    next();
}