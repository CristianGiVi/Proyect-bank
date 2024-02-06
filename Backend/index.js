const Express = require('express');

const app = Express();

// Constantes locales
require('dotenv').config();


app.listen(process.env.PORT, () => {
    console.log("Backend corriendo con exito en el servidor: " + process.env.PORT)
});
