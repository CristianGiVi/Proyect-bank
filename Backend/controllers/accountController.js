const Profile = require("../models/profile");
const State = require("../models/state");
const Type = require("../models/type");
const Account = require("../models/account");

const Slug = require("slug");
const Joi = require("@hapi/joi");


/**
 * @swagger
 * /proyect/account:
 *  get:
 *    summary: Obtener todas las cuentas
 *    description: Se muestran todas las cuentas de los perfiles
 *    responses:
 *      '200':
 *        description: Solicitud realizada con exito
 *      '500':
 *        description: Sucedio un error interno al mostrar la solicitud
 */

exports.getAll = async (request, response) => {
    try {
        let accounts = await Account.findAll({
            order: [['id', 'desc']],
            raw: true
        });

        return response.status(200).json(accounts);

    } catch (error) {
        return response.status(500)
    }
}

/**
 * @swagger
 * /proyect/account/{id}:
 *  get:
 *    summary: Obtener una cuenta por ID
 *    description: Se ingresa la id de una de las cuentas existentes y se muestran sus detalles
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: int
 *        required: true
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

        let account = await Account.findOne({
            raw:true,
            where:
            {
                'id':id
            }
        });

        if(!account){
            return response.status(404).json({mensaje: "No se encuentra una cuenta con esta ID"})             
        }
        return response.status(200).json(account);
    } catch (error) {
        return response.status(500)      
    }
}



/**
 * @swagger
 * /proyect/account/:
 *   post:
 *     summary: Agregar una nueva cuenta
 *     description: Agregar una nueva cuenta
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             balance:
 *               type: integer
 *             state_id:
 *               type: integer
 *             profile_id:
 *               type: integer
 *             type_id:
 *               type: integer
 *                
 *     responses:
 *       '201':
 *         description: Se ha creado el registro exitosamente
 *       '400':
 *         description: Ocurrió un error al guardar o ya existe el documento
 *       '404':
 *         description: No se encontró un recurso asociado
 *       '500':
 *         description: Error interno del servidor
 */

exports.post = async (request, response)=>{ 

    const {name, balance, state_id, profile_id, type_id} = request.body;

    const schema = Joi.object({
        schemaName: Joi.string().required().messages({'any.required': "El campo name es obligatorio"}),
        schemaBalance: Joi.number().required().messages({'any.required': "El campo balance es obligatorio"}),
        schemaState_id: Joi.number().required().messages({'any.required': "El campo state_id es obligatorio"}),
        schemaProfile_id: Joi.number().required().messages({'any.required': "El campo profile_id es obligatorio"}),
        schemaType_id: Joi.number().required().messages({'any.required': "El campo type_id es obligatorio"})
    });

    const {error,value} = schema.validate({
        schemaName: name,
        schemaBalance: balance,
        schemaState_id:state_id,
        schemaProfile_id: profile_id,
        schemaType_id: type_id
    });

    if(error){
        return response.status(400).json({mensaje: error.details[0].message})        
    }

    try {   
            
        let accountName = await Account.findOne({
            raw:true,
            where:
                {
                    'name':name
                }
        });     
            
        if(accountName){
            return response.status(404).json({mensaje: "Ya existe una cuenta con este nombre"})                 
        }

        let state = await State.findOne({
            where: {
                'id': state_id
            },
            raw: true
        });
    
        if(!state){
            return response.status(404).json({mensaje: "No existe un estado con esta id"})           
        }

        let type = await Type.findOne({
            where: {
                'id': type_id
            },
            raw: true
        });
    
        if(!type){
            return response.status(404).json({mensaje: "No existe un tipo con esta id"})           
        }

        let profile = await Profile.findOne({
            where: {
                'id': profile_id
            },
            raw: true
        });
    
        if(!profile){
            return response.status(404).json({mensaje: "No existe un perfil con esta id"})           
        }




        let save = await Account.create(
            {
                name:name,
                balance:balance,
                state_id:state_id,
                profile_id:profile_id,
                type_id:type_id
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
 * /proyect/account/{id}:
 *   put:
 *     summary: Actualizar una cuenta existente
 *     description: Actualiza una cuenta existente con los datos proporcionados.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la cuenta a actualizar
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               balance:
 *                 type: integer
 *               state_id:
 *                 type: integer
 *               profile_id:
 *                 type: integer
 *               type_id:
 *                 type: integer
 *     responses:
 *       '201':
 *         description: Se ha modificado el registro exitosamente
 *       '400':
 *         description: Ocurrió un error de validación en los datos proporcionados
 *       '404':
 *         description: No se encontró una cuenta con la ID proporcionada
 *       '500':
 *         description: Error interno del servidor
 */



exports.put = async (request, response)=>{
    const {id} = request.params;
    const {name, balance, state_id, profile_id, type_id} = request.body;

    const schema = Joi.object({
        schemaName: Joi.string().required().messages({'any.required': "El campo name es obligatorio"}),
        schemaBalance: Joi.number().required().messages({'any.required': "El campo balance es obligatorio"}),
        schemaState_id: Joi.number().required().messages({'any.required': "El campo state_id es obligatorio"}),
        schemaProfile_id: Joi.number().required().messages({'any.required': "El campo profile_id es obligatorio"}),
        schemaType_id: Joi.number().required().messages({'any.required': "El campo type_id es obligatorio"})
    });

    const {error,value} = schema.validate({
        schemaName: name,
        schemaBalance: balance,
        schemaState_id:state_id,
        schemaProfile_id: profile_id,
        schemaType_id: type_id
    });

    if(error){
        return response.status(400).json({mensaje: error.details[0].message})        
    }    

    try {
        let account = await Account.findOne({
            raw:true,
            where:
                {
                    'id':id
                }
        });  
            
        if(!account){
            return response.status(404).json({mensaje: "No se encuentra una cuenta con esta id"})           
        }

        await Account.update(
            {
                name:name,
                balance:balance,
                state_id:state_id,
                profile_id:profile_id,
                type_id:type_id,
                slug: Slug(name)
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


exports.delete = async (request, response)=>{
    const {id} = request.params;

    try {
        let account = await Account.findOne({
            raw:true,
            where:
            {
                'id':id
            }
        });   
                    
        if(!account){
            return response.status(404).json({mensaje: "No se encuentra una cuenta con esta id"})           
        }

        await Account.destroy({
            where: {
                'id': id
            }
        });

        return response.status(200).json({mensaje: "Se ha eliminado el registro exitosamente"});

    } catch (error) {
            return response.status(500).json({mensaje: error.mensaje})         
    }
}

