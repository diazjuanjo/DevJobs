const mongoose = require('mongoose');
const Vacante = mongoose.model('Vacante');

exports.formularioNuevaVacante = (req, res) => {
    res.render('nueva-vacante', {
        nombrePagina: 'Nueva Vacante',
        tagline: 'Llena el formulario y publica tu vacante'
    })
}

// agrega las vacantes a la DB
exports.agregarVacante = async (req, res) => {
    const vacante = new Vacante(req.body);
    // console.log(req.body);
    // crear arreglo de habilidades (skills)
    vacante.skills = req.body.skills.split(',');

    // almacenarlo en la DB
    const nuevaVacante = await vacante.save();

    // console.log(vacante);
    res.redirect(`/vacantes/${nuevaVacante.url}`);
}

// muestra una vacante
exports.mostrarVacante = async (req, res, next) => {
    const vacante = await Vacante.findOne({ url: req.params.url }).lean();

    // si no hay resultados
    if(!vacante) return next();

    res.render('vacante', {
        vacante,
        nombrePagina: vacante.titulo,
        barra: true
    })
}