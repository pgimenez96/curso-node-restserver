const { request, response } = require('express');

const usuariosGet = (req = request, res = response) => {

    const { q, nombre='', apiKey } = req.query;

    res.json({
        msg: 'get API - controller',
        q,
        nombre,
        apiKey
    });
}

const usuariosPost = (req = request, res = response) => {

    const { nombre, edad } = req.body;

    res.json({
        msg: 'post API',
        nombre,
        edad
    });

}

const usuariosPut = (req = request, res = response) => {

    const id = req.params.id;

    res.json({
        msg: 'put API',
        id: id
    });
}

const usuariosDelete = (req = request, res = response) => {
    res.json({
        msg: 'delete API'
    });
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete
}