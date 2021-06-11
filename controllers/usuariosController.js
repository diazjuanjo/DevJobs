const mongoose = require('mongoose');
const Usuarios = mongoose.model('Usuarios');
const { body, validationResult } = require('express-validator');

exports.formCrearCuenta = (req, res) => {
    res.render('crear-cuenta', {
        nombrePagina: 'Crea tu cuenta en devJobs',
        tagLine: 'Comienza a publicar tus vacantes gratis, solo tienes que crear una cuenta'
    })
}

exports.validarRegistro = (req, res, next) => {

    const errores = validationResult(req);

    // console.log(req.body);
    // console.log(errores.array());

    if(errores){
        // si hay errores
        req.flash('error', errores.array().map(error => error.msg))
        res.render('crear-cuenta', {
            nombrePagina: 'Crea tu cuenta en devJobs',
            tagLine: 'Comienza a publicar tus vacantes gratis, solo tienes que crear una cuenta',
            mensajes: req.flash()
        });
        return;
    }

    // si toda la validacion es correcta
    next();
}

exports.crearUsuario = async (req, res, next) => {
    // crear usuario
    const usuario = new Usuarios(req.body);

    try {
        await usuario.save();
        res.redirect('/iniciar-sesion');
    } catch (error) {
        req.flash('error', error);
        res.redirect('/crear-cuenta');
    }
}