const Profile = require("../models/profile");
const Joi = require("@hapi/joi");
const jwt = require('jwt-simple');
const moment = require('moment');


exports.login = async(request, response) => {
    const {email, password} = request.body;

    const schema = Joi.object({
        schemaEmail: Joi.string().email().required().messages({'any.required': "El campo email es obligatorio"}),
        schemaPassword: Joi.string().required().messages({'any.required': "El campo password es obligatorio"})
    });

    const {error,value} = schema.validate({
        schemaEmail:email,
        schemaPassword:password
    });

    if(error){
        return response.status(400).json({mensaje: error.details[0].message})        
    }

    try {
            
        let profile = await Profile.findOne({
            raw:true,
            where:
                {
                    'email':email
                }
        });  

        if(!profile){
            return response.status(400).json({mensaje: "No se encuentra ningun perfil con este correo electronico"})                 
        }

        if(profile.password.trim() !== password.trim()){
            return response.status(400).json({mensaje: "Contraseña erronea"})                 
        }

        let payload = {
            id: profile.id,
            email: profile.email,
            iat: moment().unix(),
            exp: moment().add(30, 'days').unix()
        };

        let token = jwt.encode(payload, process.env.SECRET);

        return response.status(200).json({
            mensaje: token
        });

    } catch (error) {
        return response.status(500).json({mensaje: error.mensaje})              
    }
}