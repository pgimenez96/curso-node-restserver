const { Router } = require('express');
const { check } = require('express-validator');

const { 
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete
} = require('../controllers/user');

const { esRoleValido, existeEmail, existeUsuarioPorId } = require('../helpers/db-validators');  

const {
    validarCampos,
    validarJWT,
    esAdminRole,
    tieneRol
} = require('../middlewares')

const router = Router();

router.get('/', usuariosGet);

router.put('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    check('rol').custom( esRoleValido ),
    validarCampos
], usuariosPut);

router.post('/', [
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('password', 'El password debe de ser más de 6 letras').isLength({ min: 6 }),
        check('correo', 'El correo no es valido').isEmail(),
        //check('rol', 'No es un rol permitido').isIn([ 'ADMIN_ROLE', 'USER_ROLE' ]),
        check('correo').custom( existeEmail ),
        check('rol').custom( esRoleValido ),
        validarCampos
    ]
], usuariosPost);

router.delete('/:id' ,[
    validarJWT,
    //esAdminRole,
    tieneRol('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    validarCampos
], usuariosDelete);

module.exports = router;