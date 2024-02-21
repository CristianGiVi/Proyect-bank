const Category = require("../models/category");

const Slug = require("slug");
const Joi = require("@hapi/joi");



/**
 * @swagger
 * /proyect/category/:
 *   get:
 *     summary: Obtener todos las categorias
 *     description: Obtiene una lista de todas las categorias
 *     responses:
 *       '200':
 *         description: Solicitud realizada con exito
 *       '500':
 *         description: Sucedio un error interno al mostrar la solicitud
 */

exports.getAll = async (request, response) => {
    try {
        let categories = await Category.findAll({
            order: [['id', 'desc']],
            raw: true
        });

        return response.status(200).json(categories);

    } catch (error) {
        return response.status(500)
    }
}



/**
 * @swagger
 * /proyect/category/:
 *   post:
 *     summary: Agregar una nueva categoria
 *     description: Agregar una nueva categoria con el nombre proporcionado.
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         description: Datos del nuevo tipo
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *     responses:
 *       '201':
 *         description: Se ha creado el registro exitosamente
 *       '400':
 *         description: Error de validación en los datos proporcionados
 *       '404':
 *         description: Ya existe una categoría con este nombre
 *       '500':
 *         description: Error interno del servidor
 */


exports.post = async (request, response)=>{ 

    const {name} = request.body;

    const schema = Joi.object({
        schemaName: Joi.string().required().messages({'any.required': "El campo name es obligatorio"})
    });

    const {error,value} = schema.validate({
        schemaName: name
    });

    if(error){
        return response.status(400).json({mensaje: error.details[0].message})        
    }

    try { 
            
        let category = await Category.findOne({
            raw:true,
            where:
                {
                    'name':name
                }
        });     
            
        if(category){
            return response.status(404).json({mensaje: "Ya existe una categoria con este nombre"})                 
        }

        let save = await Category.create(
            {
                name:name
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


