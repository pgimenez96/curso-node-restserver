const { request, response } = require("express");
const { ObjectId } = require('mongoose').Types;

const { Usuario, Categoria, Producto } = require('../models');
const usuario = require("../models/usuario");

const coleccionesPermitidas = [
    'usuario',
    'categoria',
    'producto',
    'rol'
];

const buscarUsuarios = async( termino, res = response ) => {

    const esMongoID = ObjectId.isValid( termino );
    if ( esMongoID ) {
        const usuario = await Usuario.findById( termino );
        return res.json({
            result: [ usuario ? [ usuario ] : [] ]
        });
    }

    const regex = new RegExp( termino, 'i' );
    const usuarios = await Usuario.find({
        $or: [{ nombre: regex }, { correo: regex }],
        $and: [{ estado: true }]
    });

    res.json({
        result: usuarios
    })

}

const buscarCategoria = async (termino, res = response) => {
    const isMongoId = ObjectId.isValid( termino );
    if ( isMongoId ) {
        const categoria = await Categoria.findById( termino ).populate('usuario', 'nombre');
        return res.json({
            result: [ categoria ? [ categoria ] : [] ]
        })
    }

    const regex = new RegExp( termino, 'i' );
    const categorias = await Categoria.find({ estado: true, nombre: regex }).populate('usuario', 'nombre');

    res.json({
        result: categorias
    })

}

const buscarProducto = async (termino, res = response) => {
    const isMongoId = ObjectId.isValid( termino );
    if ( isMongoId ) {
        const producto = await Producto.findById( termino )
            .populate('categoria', 'nombre');
        return res.json({
            result: [ producto ? [ producto ] : [] ]
        })
    }

    const regex = new RegExp( termino, 'i' );
    const producto = await Producto.find({ estado: true, nombre: regex })
        .populate('categoria', 'nombre');

    res.json({
        result: producto
    })

}

const buscar = (req = request, res = response) => {

    const { coleccion, termino } = req.params;

    if ( !coleccionesPermitidas.includes( coleccion ) ) {
        return res.status(400).json({
            msg: `Las colecciones permitida son: ${coleccionesPermitidas}`
        })
    }

    switch (coleccion) {
        case 'usuario':
            buscarUsuarios( termino, res );
            break;
        case 'categoria':
            buscarCategoria( termino, res );
            break;
        case 'producto':
            buscarProducto( termino, res );
            break;
        default:
            res.status(500).json({
                msg: `Falta implementar busqueda de ${coleccion}`
            })
    }

}

module.exports = {
    buscar
}