const Account = require("../models/account");
const Budget = require("../models/budget");
const Category = require("../models/category");
const Transaction = require("../models/transaction");

const Slug = require("slug");
const Joi = require("@hapi/joi");
const Movement = require("../models/movement");

exports.getAll = async (request, response) => {
    try {
        let transactions = await Transaction.findAll({
            order: [['id', 'desc']],
            raw: true
        });

        return response.status(200).json(transactions);

    } catch (error) {
        return response.status(500)
    }
}


exports.getOne = async (request, response)=>{
    const {id} = request.params;

    try {

        let transaction = await Transaction.findOne({
            raw:true,
            where:
            {
                'id':id
            }
        });

        if(!transaction){
            return response.status(404).json({mensaje: "No se encuentra una transaccion con esta ID"})             
        }
        return response.status(200).json(transaction);
    } catch (error) {
        return response.status(500)      
    }
}


exports.post = async (request, response)=>{ 

    const {amount, sender_id, recipient_id, budget_id, category_id, movement_id} = request.body;

    const schema = Joi.object({
        SchemaAmount: Joi.number().required().messages({ 'any.required': "El campo amount es obligatorio" }),
        SchemaSender_id: Joi.number().required().messages({ 'any.required': "El campo sender_id es obligatorio" }),
        SchemaRecipient_id: Joi.number().required().messages({ 'any.required': "El campo recipient_id es obligatorio" }),
        SchemaBudget_id: Joi.number().required().messages({ 'any.required': "El campo budget_id es obligatorio" }),
        SchemaCategory_id: Joi.number().required().messages({ 'any.required': "El campo category_id es obligatorio" }),
        SchemaMovement_id: Joi.number().required().messages({ 'any.required': "El campo movement es obligatorio" })
    });

    const { error, value } = schema.validate({
        SchemaAmount: amount,
        SchemaSender_id: sender_id,
        SchemaRecipient_id: recipient_id,
        SchemaBudget_id: budget_id,
        SchemaCategory_id: category_id,
        SchemaMovement_id: movement_id
    });

    if(error){
        return response.status(400).json({mensaje: error.details[0].message})        
    }

    try {   

        let recipient = await Account.findOne({
            where: {
                'id': recipient_id
            },
            raw: true
        });
    
        if(!recipient){
            return response.status(404).json({mensaje: "No existe una cuenta con esta id"})           
        }

        let sender = await Account.findOne({
            where: {
                'id': sender_id
            },
            raw: true
        });
    
        if(!sender){
            return response.status(4).json({mensaje: "No existe una cuenta con esta id"})           
        }

        let category = await Category.findOne({
            where: {
                'id': category_id
            },
            raw: true
        });
    
        if(!category){
            return response.status(404).json({mensaje: "No existe una categoria con esta id"})           
        }

        let budget = await Budget.findOne({
            where: {
                'id': budget_id
            },
            raw: true
        });
    
        if(!budget){
            return response.status(404).json({mensaje: "No existe un presupuesto con esta id"})           
        }

        let movement = await Movement.findOne({
            where: {
                'id': movement_id
            },
            raw: true
        });
    
        if(!movement){
            return response.status(404).json({mensaje: "No existe un movimiento con esta id"})           
        }
        let save = await Transaction.create(
            {
                amount:amount,
                sender_id:sender_id,
                recipient_id:recipient_id,
                budget_id: budget_id,
                category_id: category_id,
                movement_id: movement_id
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


exports.put = async (request, response)=>{
    const {id} = request.params;
    const {amount, sender_id, recipient_id, budget_id, category_id, movement_id} = request.body;

    const schema = Joi.object({
        SchemaAmount: Joi.number().required().messages({ 'any.required': "El campo amount es obligatorio" }),
        SchemaSender_id: Joi.number().required().messages({ 'any.required': "El campo sender_id es obligatorio" }),
        SchemaRecipient_id: Joi.number().required().messages({ 'any.required': "El campo recipient_id es obligatorio" }),
        SchemaBudget_id: Joi.number().required().messages({ 'any.required': "El campo budget_id es obligatorio" }),
        SchemaCategory_id: Joi.number().required().messages({ 'any.required': "El campo category_id es obligatorio" }),
        SchemaMovement_id: Joi.number().required().messages({ 'any.required': "El campo movement es obligatorio" })
    });

    const { error, value } = schema.validate({
        SchemaAmount: amount,
        SchemaSender_id: sender_id,
        SchemaRecipient_id: recipient_id,
        SchemaBudget_id: budget_id,
        SchemaCategory_id: category_id,
        SchemaMovement_id: movement_id
    });

    if(error){
        return response.status(400).json({mensaje: error.details[0].message})        
    }    

    try {
        let transaction = await Transaction.findOne({
            raw:true,
            where:
                {
                    'id':id
                }
        });  
            
        if(!transaction){
            return response.status(404).json({mensaje: "No se encuentra una transaccion con esta id"})           
        }

        await Transaction.update(
            {
                amount:amount,
                sender_id:sender_id,
                recipient_id:recipient_id,
                budget_id: budget_id,
                category_id: category_id,
                movement_id: movement_id,
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


exports.delete = async (request, response)=>{
    const {id} = request.params;

    try {
        let transaction = await Transaction.findOne({
            raw:true,
            where:
            {
                'id':id
            }
        });   
                    
        if(!transaction){
            return response.status(404).json({mensaje: "No se encuentra una cuenta con esta id"})           
        }

        await Transaction.destroy({
            where: {
                'id': id
            }
        });

        return response.status(200).json({mensaje: "Se ha eliminado el registro exitosamente"});

    } catch (error) {
            return response.status(500).json({mensaje: error.mensaje})         
    }
}

