const Profile = require("../models/profile");
const Phase = require("../models/phase");
const Budget = require("../models/budget");

const Slug = require("slug");
const Joi = require("@hapi/joi");



/**
 * @swagger
 * /proyect/budget/:
 *    get:
 *     summary: Obtener todos los presupuestos
 *     description: Obtiene una lista de todos los presupuestos disponibles.
 *    responses:
 *      '200':
 *        description: Solicitud realizada con exito
 *      '500':
 *        description: Sucedio un error interno al mostrar la solicitud
 */

exports.getAll = async (request, response) => {
    try {
        let budgets = await Budget.findAll({
            order: [['id', 'desc']],
            raw: true
        });

        return response.status(200).json(budgets);

    } catch (error) {
        return response.status(500)
    }
}



/**
 * @swagger
 * /proyect/budget/{id}:
 *    get:
 *     summary: Obtener un presupuesto por ID
 *     description: Obtiene un presupuesto específico basado en su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del presupuesto a obtener
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

        let budget = await Budget.findOne({
            raw:true,
            where:
            {
                'id':id
            }
        });

        if(!budget){
            return response.status(404).json({mensaje: "No se encuentra un presupuesto con esta ID"})             
        }
        return response.status(200).json(budget);
    } catch (error) {
        return response.status(500)      
    }
}


/**
 * @swagger
 * /proyect/budget/:
 *   post:
 *     summary: Agregar un nuevo presupuesto
 *     description: Agrega un nuevo presupuesto con los datos proporcionados.
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
 *                 type: number
 *               endDate:
 *                 type: string
 *                 format: date
 *               profile_id:
 *                 type: integer
 *               phase_id:
 *                 type: integer
 *     responses:
 *       '201':
 *         description: Se ha creado el registro exitosamente
 *       '400':
 *         description: Ocurrió un error de validación en los datos proporcionados
 *       '404':
 *         description: No se encontró una fase o perfil con la ID proporcionada
 *       '500':
 *         description: Error interno del servidor
 */



exports.post = async (request, response)=>{ 

    const {name, balance, endDate,profile_id, phase_id} = request.body;

    const schema = Joi.object({
        SchemaBalance: Joi.number().required().messages({ 'any.required': "El campo balance es obligatorio" }),
        SchemaName: Joi.string().required().messages({ 'any.required': "El campo name es obligatorio" }),
        SchemaEndDate: Joi.date().required().messages({ 'any.required': "El campo fecha final es obligatorio" }),
        SchemaProfile_id: Joi.number().required().messages({ 'any.required': "El campo budget_id es obligatorio" }),
        SchemaPhase_id: Joi.number().required().messages({ 'any.required': "El campo category_id es obligatorio" })
    });

    const {error,value} = schema.validate({
        SchemaBalance: balance,
        SchemaName: name,
        SchemaEndDate: endDate,
        SchemaProfile_id: profile_id,
        SchemaPhase_id: phase_id
    });

    if(error){
        return response.status(400).json({mensaje: error.details[0].message})        
    }

    try {
            
        let budget = await Budget.findOne({
            raw:true,
            where:
                {
                    'name':name
                }
        });     
            
        if(budget){
            return response.status(400).json({mensaje: "Ya existe un presupuesto con este nombre"})                 
        }

        let phase = await Phase.findOne({
            where: {
                'id': phase_id
            },
            raw: true
        });
    
        if(!phase){
            return response.status(404).json({mensaje: "No existe una fase con este id"})           
        }

        let profile = await Profile.findOne({
            where: {
                'id': profile_id
            },
            raw: true
        });
    
        if(!profile){
            return response.status(404).json({mensaje: "No existe una perfil con este id"})           
        }


        let save = await Budget.create(
            {
                balance: balance,
                name: name,
                endDate: endDate,
                profile_id: profile_id,
                phase_id: phase_id
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
 * /proyect/budget/{id}:
 *   put:
 *     summary: Actualizar un presupuesto existente
 *     description: Actualiza un presupuesto existente con los datos proporcionados.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del presupuesto a actualizar
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
 *                 type: number
 *               endDate:
 *                 type: string
 *                 format: date
 *               profile_id:
 *                 type: integer
 *               phase_id:
 *                 type: integer
 *     responses:
 *       '201':
 *         description: Se ha modificado el registro exitosamente
 *       '400':
 *         description: Ocurrió un error de validación en los datos proporcionados
 *       '404':
 *         description: No se encontró un presupuesto con la ID proporcionada
 *       '500':
 *         description: Error interno del servidor
 */



exports.put = async (request, response)=>{
    const {name, balance, endDate,profile_id, phase_id} = request.body;

    const schema = Joi.object({
        SchemaBalance: Joi.number().required().messages({ 'any.required': "El campo balance es obligatorio" }),
        SchemaName: Joi.string().required().messages({ 'any.required': "El campo name es obligatorio" }),
        SchemaEndDate: Joi.date().required().messages({ 'any.required': "El campo fecha final es obligatorio" }),
        SchemaProfile_id: Joi.number().required().messages({ 'any.required': "El campo budget_id es obligatorio" }),
        SchemaPhase_id: Joi.number().required().messages({ 'any.required': "El campo category_id es obligatorio" })
    });

    const {error,value} = schema.validate({
        SchemaBalance: balance,
        SchemaName: name,
        SchemaEndDate: endDate,
        SchemaProfile_id: profile_id,
        SchemaPhase_id: phase_id
    });

    if(error){
        return response.status(400).json({mensaje: error.details[0].message})        
    }

    try {
        let budget = await Budget.findOne({
            raw:true,
            where:
                {
                    'id':id
                }
        });  
            
        if(!budget){
            return response.status(404).json({mensaje: "No se encuentra una transaccion con esta id"})           
        }

        await Budget.update(
            {
                balance: balance,
                name: name,
                endDate: endDate,
                profile_id: profile_id,
                phase_id: phase_id,
                slug: Slug(String(amount))
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
 * /proyect/budget/{id}:
 *   delete:
 *     summary: Eliminar un presupuesto por ID
 *     description: Elimina un presupuesto específico basado en su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del presupuesto a eliminar
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Se ha eliminado el presupuesto exitosamente
 *       '404':
 *         description: No se encontró un presupuesto con la ID proporcionada
 *       '500':
 *         description: Error interno del servidor
 */


exports.delete = async (request, response)=>{
    const {id} = request.params;

    try {
        let budget = await Budget.findOne({
            raw:true,
            where:
            {
                'id':id
            }
        });   
                    
        if(!budget){
            return response.status(404).json({mensaje: "No se encuentra una cuenta con esta id"})           
        }

        await Budget.destroy({
            where: {
                'id': id
            }
        });

        return response.status(200).json({mensaje: "Se ha eliminado el registro exitosamente"});

    } catch (error) {
            return response.status(500).json({mensaje: error.mensaje})         
    }
}


