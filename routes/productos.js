const { Router } = require('express');
const { check } = require('express-validator');
const {
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    borrarProducto, 
} = require('../controllers/productos');
const { 
    validarJWT,
    validarCampos,
    tieneRol
} = require('../middlewares');
const { 
    existeProductoPorId
 } = require('../helpers/db-validators');

const router = Router();

// {{urlBase}}/api/productos

// Retorna todos los productos
router.get('/', obtenerProductos);

// Retorna un solo registro de producto
router.get('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
], obtenerProducto);

// Crea registro de producto - privado
router.post('/', [
    validarJWT,
    check('nombre', 'Nombre de producto es obligatorio').not().isEmpty(),
    check('categoria', 'Nombre de categoría es obligatorio').not().isEmpty(),
    validarCampos
], crearProducto);

// Actualiza registro de producto por su ID - privado
router.put('/:id', [
    validarJWT,
    check('id', 'No es un ID valido').isMongoId(),
    check('nombre', 'Nombre de producto es obligarorio').not().isEmpty(),
    check('categoria', 'Nombre de categoría es obligatorio').not().isEmpty(),
    check('id').custom( existeProductoPorId ),
    validarCampos
], actualizarProducto);

// Borrar registro de producto por su ID - privado - Admin
router.delete('/:id', [
    validarJWT,
    tieneRol('ADMIN_ROLE'),
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
], borrarProducto);

module.exports = router;