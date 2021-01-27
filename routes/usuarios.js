const express = require('express');
const Joi = require('@hapi/joi');
const ruta = express.Router();

const usuarios = [
    {id:1, nombre:"juan"},
    {id:2, nombre:"cristian"},
    {id:3, nombre:"gustavo"}
];

//http://localhost:5000/
ruta.get('/', (req, res) => {
    res.send('hola mundo desde express');
});

//http://localhost:5000/api/usuarios/todos
ruta.get('/todos', (req, res) => {
    res.send(usuarios);
});

//http://localhost:5000/api/usuarios/{ID}
ruta.get('/:id', (req, res) => {
    let usuario = existeUsuario(req.params.id);
    if ( ! usuario) res.status(404).send('El usuario no fue encontrado');
    res.send(usuario);
});

//http://localhost:3000/api/usuarios/
ruta.post('/', (req, res) => {    
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
ruta.put('/:id', (req, res) => {
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

ruta.delete('/:id', (req, res) => {
    let usuario = existeUsuario(req.params.id);
    if ( ! usuario) res.status(404).send('El usuario no fue encontrado');
    const index = usuarios.indexOf(usuario);
    usuarios.splice(index, 1);
    res.send(usuario);
});

function existeUsuario(id){
    return usuarios.find(usuario => usuario.id == parseInt(id));
}

function validarNombreUsuario(nombre){
    const schema = Joi.object({nombre: Joi.string().min(3).max(10).required()});
    return schema.validate({ nombre: nombre});
}

module.exports = ruta;