// Importamos el módulo 'express' y lo asignamos a la variable 'Express'
const Express = require('express');

const Mysql = require('./database/mysqldb');

const BodyParser = require("body-parser")

const SwaggerJsDoc = require('swagger-jsdoc');
const SwaggerUi = require('swagger-ui-express');
const Cors = require('cors');



// Creamos una nueva instancia de la aplicación Express
const app = Express();

// Cargamos las variables de entorno del archivo '.env' utilizando el módulo 'dotenv'
require('dotenv').config();

// Middlewares para body parser
app.use(BodyParser.urlencoded({ extended: false }));
app.use(BodyParser.json());

// Agregar el middleware de CORS a tu aplicación
app.use(Cors());

// Usamos las rutas definidas en el archivo de rutas 'routes.js'
app.use("/", require("./routes/routes"));

// Conexion base de datos
Mysql.sync()
    .then(() => {
        console.log("Conectados a la base de datos");
    })
    .catch(error => {
        console.log(error);
    });
require("./models/budget");
require("./models/phase");
require("./models/profile");
require("./models/state");
require("./models/type");
require("./models/account");
require("./models/category");
require("./models/transaction");

// Config swagger
const swaggerOptions = {
    swaggerDefinition: {
      info: {
        title: 'API proyecto fullStack',
        description: '',
        contact: {
          name: 'Cristian Giraldo',
        },
        servers: [`http://localhost:${process.env.PORT}`],
      },
    },
    apis: [
      './controllers/*.js'
    ],
  };
  
const swaggerDocs = SwaggerJsDoc(swaggerOptions);
app.use('/api-docs', SwaggerUi.serve, SwaggerUi.setup(swaggerDocs));
// -----------

// Iniciamos el servidor Express y lo configuramos para que escuche en el puerto especificado por la variable de entorno 'PORT'
app.listen(process.env.PORT, () => {
    console.log(`Backend corriendo con exito en el servidor: ${process.env.PORT}`)
});
