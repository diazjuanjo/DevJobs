const mongoose = require('mongoose');
const Usuarios = mongoose.model('Usuarios');

exports.formCrearCuenta = (req, res) => {
    res.render('crear-cuenta', {
        nombrePagina: 'Crea tu cuenta en devJobs',
        tagLine: 'Comienza a publicar tus vacantes gratis, solo tienes que crear una cuenta'
    })
}

exports.crearUsuario = async (req, res, next) => {
    // crear usuario
    const usuario = new Usuarios(req.body);

    const nuevoUsuario = await usuario.save();

    if(!usuario) return next();

    res.redirect('/iniciar-sesion');

    // console.log(usuario);
}