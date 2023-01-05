const Role = require('../models/role');
const Usuario = require('../models/usuario');

const esRoleValido = async (rol = '') => {
    const existeRol = await Role.findOne({ rol });
    if ( !existeRol ) {
        throw new Error(`El rol ${rol} no está registrado en la base de datos`);
    }
}



const existeEmail = async( correo = '' ) => {
    const user = await Usuario.findOne({ correo });
    if ( user ) {
        throw new Error(`El correo ${correo} ya existe`);
    }
}

const existeUsuarioPorId = async( id = '' ) => {
    const user = await Usuario.findById(id);
    if ( ! user ) {
        throw new Error(`El id ${id} no existe`);
    }
}

module.exports = {
    esRoleValido,
    existeEmail,
    existeUsuarioPorId
}