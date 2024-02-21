// Importamos el módulo 'express' y lo asignamos a la variable 'Express'
const Express = require('express');
const profileController = require('../controllers/profileController');
const accountController = require('../controllers/accountController');
const transactionController = require('../controllers/transactionController');
const budgetController = require('../controllers/budgetController');
const phaseController = require('../controllers/phaseController');
const stateController = require('../controllers/stateController');
const typeController = require('../controllers/typeController');
const categoryController = require('../controllers/categoryController');
const movementController = require('../controllers/movementController');

const Router = Express.Router();

const PAGE_ROUTE = "/proyect";

// PROFILE

const SUB_PATH_PROFILE = "profile"
Router.get(`${PAGE_ROUTE}/${SUB_PATH_PROFILE}`, profileController.getAll);
Router.get(`${PAGE_ROUTE}/${SUB_PATH_PROFILE}/:id`, profileController.getOne);
Router.post(`${PAGE_ROUTE}/${SUB_PATH_PROFILE}`, profileController.post);
Router.put(`${PAGE_ROUTE}/${SUB_PATH_PROFILE}/:id`, profileController.put);
Router.delete(`${PAGE_ROUTE}/${SUB_PATH_PROFILE}/:id`, profileController.delete);

// ACCOUNT

const SUB_PATH_ACCOUNT = "account"
Router.get(`${PAGE_ROUTE}/${SUB_PATH_ACCOUNT}`, accountController.getAll);
Router.get(`${PAGE_ROUTE}/${SUB_PATH_ACCOUNT}/:id`, accountController.getOne);
Router.post(`${PAGE_ROUTE}/${SUB_PATH_ACCOUNT}`, accountController.post);
Router.put(`${PAGE_ROUTE}/${SUB_PATH_ACCOUNT}/:id`, accountController.put);
Router.delete(`${PAGE_ROUTE}/${SUB_PATH_ACCOUNT}/:id`, accountController.delete);

// TRANSACTION

const SUB_PATH_TRANSACTION = "transaction"
Router.get(`${PAGE_ROUTE}/${SUB_PATH_TRANSACTION}`, transactionController.getAll);
Router.get(`${PAGE_ROUTE}/${SUB_PATH_TRANSACTION}/:id`, transactionController.getOne);
Router.post(`${PAGE_ROUTE}/${SUB_PATH_TRANSACTION}`, transactionController.post);
Router.put(`${PAGE_ROUTE}/${SUB_PATH_TRANSACTION}/:id`, transactionController.put);
Router.delete(`${PAGE_ROUTE}/${SUB_PATH_TRANSACTION}/:id`, transactionController.delete);

// BUDGET

const SUB_PATH_BUDGET = "budget"
Router.get(`${PAGE_ROUTE}/${SUB_PATH_BUDGET}`, budgetController.getAll);
Router.get(`${PAGE_ROUTE}/${SUB_PATH_BUDGET}/:id`, budgetController.getOne);
Router.post(`${PAGE_ROUTE}/${SUB_PATH_BUDGET}`, budgetController.post);
Router.put(`${PAGE_ROUTE}/${SUB_PATH_BUDGET}/:id`, budgetController.put);
Router.delete(`${PAGE_ROUTE}/${SUB_PATH_BUDGET}/:id`, budgetController.delete);

// PHASE

const SUB_PATH_PHASE = "phase"
Router.get(`${PAGE_ROUTE}/${SUB_PATH_PHASE}`, phaseController.getAll);
Router.post(`${PAGE_ROUTE}/${SUB_PATH_PHASE}`, phaseController.post);

// STATE

const SUB_PATH_STATE = "state"
Router.get(`${PAGE_ROUTE}/${SUB_PATH_STATE}`, stateController.getAll);
Router.post(`${PAGE_ROUTE}/${SUB_PATH_STATE}`, stateController.post);

// TYPE

const SUB_PATH_TYPE = "type"
Router.get(`${PAGE_ROUTE}/${SUB_PATH_TYPE}`, typeController.getAll);
Router.post(`${PAGE_ROUTE}/${SUB_PATH_TYPE}`, typeController.post);

// CATEGORY

const SUB_PATH_CATEGORY = "category"
Router.get(`${PAGE_ROUTE}/${SUB_PATH_CATEGORY}`, categoryController.getAll);
Router.post(`${PAGE_ROUTE}/${SUB_PATH_CATEGORY}`, categoryController.post);

// MOVEMENT

const SUB_PATH_MOVEMENT = "movement"
Router.get(`${PAGE_ROUTE}/${SUB_PATH_MOVEMENT}`, movementController.getAll);
Router.post(`${PAGE_ROUTE}/${SUB_PATH_MOVEMENT}`, movementController.post);




module.exports = Router;
