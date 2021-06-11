const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const vacantesController = require('../controllers/vacantesController');
const usuariosController = require('../controllers/usuariosController');
const { check } = require('express-validator');

module.exports = (req, res) => {
    router.get('/', homeController.mostrarTrabajos);

    // Crear Vacantes
    router.get('/vacantes/nueva', vacantesController.formularioNuevaVacante);
    router.post('/vacantes/nueva', vacantesController.agregarVacante);

    // Mostrar Vacante
    router.get('/vacantes/:url', vacantesController.mostrarVacante);

    // Editar Vacante
    router.get('/vacantes/editar/:url', vacantesController.formEditarVacante);
    router.post('/vacantes/editar/:url', vacantesController.editarVacante);

    // Crear Cuentas
    router.get('/crear-cuenta', usuariosController.formCrearCuenta);
    router.post('/crear-cuenta',
        [
            check('nombre', 'El Nombre es Obligatorio').not().isEmpty(),
            check('email', 'El email debe ser válido').isEmail(),
            check('password', 'El password no puede ir vacío').not().isEmpty(),
            check('confirmar', 'Confirmar password no puede ir vacío').not().isEmpty(),
            check('confirmar', 'El password es diferente').custom((value, {req}) => (value === req.body.password))
        ],
        usuariosController.validarRegistro,
        usuariosController.crearUsuario
    );

    return router;
}