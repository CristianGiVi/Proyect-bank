const Profile = require("../models/profile");
const State = require("../models/state");
const Slug = require("slug");
const Joi = require("@hapi/joi");



/**
 * @swagger
 * /proyect/profile/:
 *    get:
 *     summary: Obtener todos los perfiles
 *     description: Obtiene una lista de todos los perfiles.
 *    responses:
 *      '200':
 *        description: Solicitud realizada con exito
 *      '500':
 *        description: Sucedio un error interno al mostrar la solicitud
 */

exports.getAll = async (request, response) => {
    try {
        let profiles = await Profile.findAll({
            order: [['id', 'desc']],
            raw: true
        });

        return response.status(200).json(profiles);

    } catch (error) {
        return response.status(500)
    }
}


/**
 * @swagger
 * /proyect/profile/{id}:
 *    get:
 *     summary: Obtener un perfil por ID
 *     description: Obtiene un perfil específico basado en su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del perfil a obtener
 *         schema:
 *           type: integer
 *    responses:
 *      '200':
 *        description: Solicitud realizada con exito
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *      '404':
 *         description: No se encontró un recurso asociado
 *      '500':
 *         description: Error interno del servidor
 */


exports.getOne = async (request, response)=>{
    const {id} = request.params;

    try {

        let profile = await Profile.findOne({
            raw:true,
            where:
            {
                'id':id
            }
        });

        if(!profile){
            return response.status(404).json({mensaje: "No se encuentra un perfil con esta ID"})             
        }
        return response.status(200).json(profile);
    } catch (error) {
        return response.status(500)      
    }
}


/**
 * @swagger
 * /proyect/profile/:
 *   post:
 *     summary: Agregar un nuevo perfil
 *     description: Agrega un nuevo perfil con los datos proporcionados.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *               state_id:
 *                 type: integer
 *     responses:
 *       '201':
 *         description: Se ha creado el registro exitosamente
 *       '400':
 *         description: Ocurrió un error de validación en los datos proporcionados
 *       '404':
 *         description: No se encontró un estado con la ID proporcionada
 *       '500':
 *         description: Error interno del servidor
 */



exports.post = async (request, response)=>{ 

    const {email, password, state_id} = request.body;

    const schema = Joi.object({
        schemaEmail: Joi.string().email().required().messages({'any.required': "El campo email es obligatorio"}),
        schemaPassword: Joi.string().required().messages({'any.required': "El campo password es obligatorio"}),
        schemaState_id: Joi.number().required().messages({'any.required': "El campo state_id es obligatorio"})
    });

    const {error,value} = schema.validate({
        schemaEmail:email,
        schemaPassword:password,
        schemaState_id:state_id
    });

    if(error){
        return response.status(400).json({mensaje: error.details[0].message})        
    }

    try {
            
        let emailProfile = await Profile.findOne({
            raw:true,
            where:
                {
                    'email':email
                }
        });     
            
        if(emailProfile){
            return response.status(400).json({mensaje: "Ya existe este un perfil con este correo"})                 
        }

        let status = await State.findOne({
            where: {
                'id': state_id
            },
            raw: true
        });
    
        if(!status){
            return response.status(404).json({mensaje: "No existe un estado con esta id"})           
        }

        let save = await Profile.create(
            {
                email:email,
                password:password,
                state_id:state_id
            }
        );

        if(!save){
            return response.status(500).json({mensaje: "Ocurrio un error al guardar"})
        }else{
            return response.status(201).json({mensaje: "Se ha creado el registro exitosamente"});
        }
            
    } catch (error) {
        return response.status(500).json({mensaje: error.mensaje})              
    }
}


/**
 * @swagger
 * /proyect/profile/{id}:
 *   put:
 *     summary: Actualizar un perfil por ID
 *     description: Actualiza un perfil existente con los datos proporcionados.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del perfil a actualizar
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *               state_id:
 *                 type: integer
 *     responses:
 *       '201':
 *         description: Se ha modificado el registro exitosamente
 *       '400':
 *         description: Ocurrió un error de validación en los datos proporcionados
 *       '404':
 *         description: No se encontró un perfil con la ID proporcionada
 *       '500':
 *         description: Error interno del servidor
 */


exports.put = async (request, response)=>{
    const {id} = request.params;
    const {email, password, state_id} = request.body;

    const schema = Joi.object({
        schemaEmail: Joi.string().email().required().messages({'any.required': "El campo email es obligatorio"}),
        schemaPassword: Joi.string().required().messages({'any.required': "El campo password es obligatorio"}),
        schemaState_id: Joi.number().required().messages({'any.required': "El campo state_id es obligatorio"})
    });

    const {error,value} = schema.validate({
        schemaEmail:email,
        schemaPassword:password,
        schemaState_id:state_id
    });

    if(error){
        return response.status(400).json({mensaje: error.details[0].message})        
    }      

    try {
        let profile = await Profile.findOne({
            raw:true,
            where:
                {
                    'id':id
                }
        });  
            
        if(!profile){
            return response.status(404).json({mensaje: "No se encuentra un perfil con esta id"})           
        }

        await Profile.update(
            {
                email:email,
                password:password,
                state_id:state_id,
                slug: Slug(email)
            },
            {
                where: {id: id}
            }
        );           

            return response.status(201).json({mensaje: "Se ha modificado el registro exitosamente"});

        } catch (error) {
            return response.status(500).json({mensaje: error.mensaje})                          
        }
}

/**
 * @swagger
 * /proyect/profile/{id}:
 *   delete:
 *     summary: Eliminar un perfil por ID
 *     description: Elimina un perfil específico basado en su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del perfil a eliminar
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Se ha eliminado el perfil exitosamente
 *       '404':
 *         description: No se encontró un perfil con la ID proporcionada
 *       '500':
 *         description: Error interno del servidor
 */


exports.delete = async (request, response)=>{
    const {id} = request.params;

    try {
        let profile = await Profile.findOne({
            raw:true,
            where:
            {
                'id':id
            }
        });   
                    
        if(!profile){
            return response.status(404).json({mensaje: "No se encuentra un perfil con esta id"})           
        }

        await Profile.destroy({
            where: {
                'id': id
            }
        });

        return response.status(200).json({mensaje: "Se ha eliminado el registro exitosamente"});

    } catch (error) {
            return response.status(500).json({mensaje: error.mensaje})         
    }
}


