const { response, request } = require("express");
const { Categoria } = require('../models');

// obtenerCategorias - paginado - total - populate
const obtenerCategorias = async(req = request, res = response) => {

    const query = { estado: true }
    const { desde = 0, limite = 5 } = req.query;
    const [ total, categorias ] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
            .skip( Number(desde) )
            .limit( Number(limite) )
            .populate('usuario', 'nombre')
    ]);

    res.status(200).json({
        total,
        categorias
    });

}

// obtenerCategoria - populate → {}
const obtenerCategoria = async(req = request, res = response) => {

    const { id = '' } = req.params;
    const categoria = await Categoria.findById( id )
            .populate('usuario', 'nombre');

    res.json( categoria );

}

const crearCategoria = async (req, res = response) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({ nombre });
    if ( categoriaDB ) {
        return res.status(400).json({
            msg: `La categoría ${nombre} ya existe`
        });
    }

    // Generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria( data );
    await categoria.save();

    res.status(201).json( categoria );

}

// actualizarCategoria
const actualizarCategoria = async(req = request, res = response) => {

    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true });

    res.json( categoria )

}

// borrarCategoria - estado:false
const borrarCategoria = async(req = request, res = response) => {

    const { id } = req.params;
    
    const categoria = await Categoria.findByIdAndUpdate(id, { estado: false }, { new: true });

    res.json( categoria );

}

module.exports = {
    crearCategoria,
    obtenerCategoria,
    obtenerCategorias,
    actualizarCategoria,
    borrarCategoria
}