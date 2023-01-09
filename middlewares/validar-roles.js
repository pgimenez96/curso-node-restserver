const { response } = require("express")

const esAdminRole = ( req, res = response, next ) => {

    if ( !req.usuario ) {
        return res.status(500).json({
            msg: 'Se quiere verificar el rol antes de validar el token'
        })
    }

    const { nombre, rol } = req.usuario;

    if ( rol !== 'ADMIN_ROLE' ) {
        return res.status(500).json({
            msg: `${nombre} no es administrador - No puede hacer esta operación`
        })
    }
    
    next();

}

const tieneRol = ( ...roles ) => {

    return ( req, res = response, next ) => {

        if ( !req.usuario ) {
            return res.status(500).json({
                msg: 'Se quiere verificar el rol antes de validar el token'
            })
        }

        if ( !roles.includes( req.usuario.rol ) ) {
            return res.status(401).json({
                msg: `El servicio requiere uno de estos roles ${roles}`
            })
        }

        next();

    }

}

module.exports = {
    esAdminRole,
    tieneRol
}