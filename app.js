const usuarios = require('./routes/usuarios');
const express = require('express');
const config = require('config');

//Activar depuraciones
const debug = require('debug')('app:inicio');
//const dbDebug = require('debug')('app:db');

//const logger = require('./logger');
const morgan = require('morgan');
const app = express();

app.use(express.json());//body en formato JSON
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
app.use('/api/usuarios', usuarios);

//Middleware
//app.use(logger);
/*app.use(function(req, res, next){
    console.log('Autenticando...');
    next();
});*/

//Configuraciones de entornos
console.log('Aplicación: ' + config.get('nombre'));
console.log('BD server: ' + config.get('configDB.host'));

//Uso de un middleware de terceros
//Muestra información para la request
if (app.get('env') == 'development'){
    app.use(morgan('tiny'));
    //console.log('Morgan habilitado');
    debug('Morga esta habilitado');
}

//Trabajos con la base de datos
debug('Conectando con la base de datos');

//Iniciar API
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`escuchando en el puerto ${port}...`);
});