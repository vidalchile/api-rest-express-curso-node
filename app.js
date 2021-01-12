const express = require('express');
const config = require('config');

//Activar depuraciones
const debug = require('debug')('app:inicio');
//const dbDebug = require('debug')('app:db');

//const logger = require('./logger');
const morgan = require('morgan');
const Joi = require('@hapi/joi');
const app = express();

app.use(express.json());//body en formato JSON
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));

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

const usuarios = [
    {id:1, nombre:"juan"},
    {id:2, nombre:"cristian"},
    {id:3, nombre:"gustavo"}
];

//http://localhost:5000/
app.get('/', (req, res) => {
    res.send('hola mundo desde express');
});

//http://localhost:5000/api/usuarios
app.get('/api/usuarios', (req, res) => {
    res.send(usuarios);
});

//http://localhost:5000/api/usuarios/{ID}
app.get('/api/usuarios/:id', (req, res) => {
    let usuario = existeUsuario(req.params.id);
    if ( ! usuario) res.status(404).send('El usuario no fue encontrado');
    res.send(usuario);
});

//http://localhost:3000/api/usuarios/
app.post('/api/usuarios', (req, res) => {    
    const {error, value} = validarNombreUsuario(req.body.nombre);
    if (error){
        const message = error.details[0].message;
        res.status(400).send(message);   
    }
    const usuario = {
        id:usuarios.length + 1,
        nombre: value.nombre
    };
    usuarios.push(usuario);
    res.send(usuario);
});

//http://localhost:3000/api/usuarios/{ID}
app.put('/api/usuarios/:id', (req, res) => {
    //Encontrar si existe el usuario a modificar
    let usuario = existeUsuario(req.params.id);
    if ( ! usuario) res.status(404).send('El usuario no fue encontrado');
    //Validar si el nombre es es correcto
    const {error, value} = validarNombreUsuario(req.body.nombre);
    if (error){
        const message = error.details[0].message;
        res.status(400).send(message);    
    }
    //Actualizar datos del usuario
    usuario.nombre = value.nombre;
    res.send(usuario);
});

app.delete('/api/usuarios/:id', (req, res) => {
    let usuario = existeUsuario(req.params.id);
    if ( ! usuario) res.status(404).send('El usuario no fue encontrado');
    const index = usuarios.indexOf(usuario);
    usuarios.splice(index, 1);
    res.send(usuario);
});

//Iniciar API
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`escuchando en el puerto ${port}...`);
});

function existeUsuario(id){
    return usuarios.find(usuario => usuario.id == parseInt(id));
}

function validarNombreUsuario(nombre){
    const schema = Joi.object({nombre: Joi.string().min(3).max(10).required()});
    return schema.validate({ nombre: nombre});
}