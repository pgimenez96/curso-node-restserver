const { request, response } = require("express");
const { Producto, Categoria } = require('../models');

const obtenerProductos = async(req = request, res = response) => {

    const query = { estado: true };
    const { desde = 0, limite = 5 } = req.query;
    const [ total, productos ] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find( query )
            .skip( Number(desde) )
            .limit( Number(limite) )
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
    ]);

    res.json({
        total,
        productos
    });

}

const obtenerProducto = async(req = request, res = response) => {

    const { id='' } = req.params;
    const product = await Producto.findById(id)
                        .populate('usuario', 'nombre')
                        .populate('categoria', 'nombre');

    res.json( product );

}

const crearProducto = async(req = request, res = response) => {

    const { 
        nombre,
        precio = 0,
        categoria,
        descripcion = '',
        disponible = true } = req.body;

    const categoriaDB = await Categoria.findOne({ nombre: categoria });
    if ( !categoriaDB ) {
        return res.status(400).json({
            msg: `No existe una categoría con nombre ${categoria}`
        });
    }

    const productDB = await Producto.findOne({ nombre });
    if ( productDB ) {
        return res.status(400).json({
            msg: `Ya existe un producto con nombre ${nombre}`
        });
    }

    const productData = {
        nombre: nombre.toUpperCase(),
        estado: true,
        usuario: req.usuario._id,
        precio,
        categoria: categoriaDB._id,
        descripcion,
        disponible
    }

    const product = new Product( productData );
    const result = await Producto.save();

    res.json( result );

}

const actualizarProducto = async(req = request, res = response) => {

    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    const categoriaDB = await Categoria.findOne({ nombre: data.categoria });
    if ( !categoriaDB ) {
        return res.status(400).json({
            msg: `No existe una categoría con nombre ${data.categoria}`
        });
    }

    data.nombre = data.nombre.toUpperCase();
    data.categoria = categoriaDB._id;
    data.usuario = req.usuario._id;

    const product = await Producto.findOneAndUpdate(id, data, { new: true });

    res.json( product );

}

const borrarProducto = async(req = request, res = response) => {

    const { id } = req.params;
    const product = await Producto.findOneAndUpdate(id, { estado: false }, { new: true });

    res.json( product );

}

module.exports = {
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    borrarProducto
}