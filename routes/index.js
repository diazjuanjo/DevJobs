const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const vacantesController = require('../controllers/vacantesController');
const usuariosController = require('../controllers/usuariosController');
const authController = require('../controllers/authController')

const { check } = require('express-validator');

module.exports = (req, res) => {
    router.get('/', homeController.mostrarTrabajos);

    // Crear Vacantes
    router.get('/vacantes/nueva',
        authController.verificarUsuario,
        vacantesController.formularioNuevaVacante
    );
    router.post('/vacantes/nueva',
        authController.verificarUsuario,
        [
            check('titulo', 'Agrega un Titulo a la Vacante').not().isEmpty(),
            check('empresa', 'Agrega una Empresa').not().isEmpty(),
            check('ubicacion', 'Agrega una Ubicacion').not().isEmpty(),
            check('contrato', 'Selecciona el Tipo de Contrato').not().isEmpty(),
            check('skills', 'Agrega al menos una habilidad').not().isEmpty()
        ],
        vacantesController.validarVacante,
        vacantesController.agregarVacante
    );

    // Mostrar Vacante
    router.get('/vacantes/:url', vacantesController.mostrarVacante);

    // Editar Vacante
    router.get('/vacantes/editar/:url',
        authController.verificarUsuario,
        vacantesController.formEditarVacante
    );
    router.post('/vacantes/editar/:url',
        authController.verificarUsuario,
        vacantesController.editarVacante
    );

    // Eliminar Vacantes
    router.delete('/vacantes/eliminar/:id', vacantesController.eliminarVacante);

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

    // Autenticar Usuarios
    router.get('/iniciar-sesion', usuariosController.formIniciarSesion);
    router.post('/iniciar-sesion', authController.autenticarUsuario);
    // cerrar sesion
    router.get('/cerrar-sesion',
        authController.verificarUsuario,
        authController.cerrarSesion
    );

    // Panel de Administracion
    router.get('/administracion',
        authController.verificarUsuario,
        authController.mostrarPanel
    );

    // Editar perfil
    router.get('/editar-perfil',
        authController.verificarUsuario,
        usuariosController.formEditarPerfil
    );
    router.post('/editar-perfil',
        authController.verificarUsuario,
        [
            check('nombre', 'El Nombre es Obligatorio').not().isEmpty(),
            check('email', 'El email debe ser válido').isEmail()
        ],
        usuariosController.validarPerfil,
        usuariosController.editarPerfil
    );
    

    return router;
}