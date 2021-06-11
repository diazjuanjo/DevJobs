const mongoose = require('mongoose');
const Usuarios = mongoose.model('Usuarios');
const { validationResult } = require('express-validator');

exports.formCrearCuenta = (req, res) => {
    res.render('crear-cuenta', {
        nombrePagina: 'Crea tu cuenta en devJobs',
        tagline: 'Comienza a publicar tus vacantes gratis, solo tienes que crear una cuenta'
    })
}

exports.validarRegistro = (req, res, next) => {

    let errores = validationResult(req);

    errores = errores.errors;

    if(errores.length > 0){
        // si hay errores
        req.flash('error', errores.map(error => error.msg));
        res.render('crear-cuenta', {
            nombrePagina: 'Crea tu cuenta en devJobs',
            tagline: 'Comienza a publicar tus vacantes gratis, solo tienes que crear una cuenta',
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

exports.formIniciarSesion = (req, res) => {
    res.render('iniciar-sesion', {
        nombrePagina: 'Iniciar Sesión devJobs'
    })
}