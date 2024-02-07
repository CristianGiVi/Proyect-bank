// Importamos el módulo 'express' y lo asignamos a la variable 'Express'
const Express = require('express');
const profileController = require('../controllers/profileController')

const Router = Express.Router()

const PAGE_ROUTE = "/proyect";

// PROFILE

const SUB_PATH_ACCOUNT = "profile"
Router.get(`${PAGE_ROUTE}/${SUB_PATH_ACCOUNT}`, profileController.getAll);
Router.get(`${PAGE_ROUTE}/${SUB_PATH_ACCOUNT}/:id`, profileController.getOne);
Router.post(`${PAGE_ROUTE}/${SUB_PATH_ACCOUNT}`, profileController.post);
Router.put(`${PAGE_ROUTE}/${SUB_PATH_ACCOUNT}/:id`, profileController.put);
Router.delete(`${PAGE_ROUTE}/${SUB_PATH_ACCOUNT}/:id`, profileController.delete);


module.exports = Router;
