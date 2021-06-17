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

// Form editar el perfil
exports.formEditarPerfil = (req, res) => {
    const usuario = req.user.toJSON()
    // console.log(usuario);
    res.render('editar-perfil', {
        nombrePagina: 'Edita tu perfil en devJobs',
        usuario,
        cerrarSesion: true,
        nombre: req.user.nombre
    })
}

// Guardar cambios editar perfil
exports.editarPerfil = async (req, res) => {
    const usuario = await Usuarios.findById(req.user._id);

    usuario.nombre = req.body.nombre;
    usuario.email = req.body.email;
    if(req.body.password){
        usuario.password = req.body.password;
    }
    await usuario.save();

    req.flash('correcto', 'Cambios guardados correctamente');
    // redirect
    res.redirect('/administracion');
}

// validar el formulario de editar perfiles
exports.validarPerfil = (req, res, next) => {
    const usuario = req.user.toJSON()
    let errores = validationResult(req);

    errores = errores.errors;

    if(errores.length > 0){
        // si hay errores
        req.flash('error', errores.map(error => error.msg));
        res.render('editar-perfil', {
            nombrePagina: 'Edita tu perfil en devJobs',
            usuario,
            cerrarSesion: true,
            nombre: req.user.nombre,
            mensajes: req.flash()
        });
        return;
    }

    // si toda la validacion es correcta
    next();
}