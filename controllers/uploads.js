
const fs = require('fs')
const path = require('path')
const { response } = require("express");
const { subirArchivo } = require("../helpers");
const { Usuario, Producto } = require('../models')
const cloudinary = require('cloudinary').v2

cloudinary.config( process.env.CLOUDINARY_URL )

const cargarArchivo = async (req, res = response) => {

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        return res.status(400).json({ msg: 'No se recibio archivo en la peticion' });
    }

    try {
        
        const nombre = await subirArchivo( req.files, undefined, 'imgs' )
    
        res.json({
            nombre
        })

    } catch (error) {
        res.status(400).json({ msg: error })
    }


}

const actualizarImagen = async (req, res = response) => {

    const { id, coleccion } = req.params;

    let modelo;
    switch ( coleccion ) {
        case 'usuarios':

            modelo = await Usuario.findById(id).exec()
            if ( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                })
            }

            break;
        case 'productos':

            modelo = await Producto.findById(id).exec()
            if ( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                })
            }

            break;
        default:
            return res.status(500).json({ msg: 'Se me olvido validar esto' })
    }

    // Limpiar imagenes previas
    if ( modelo.img ) {
        const pathImg = path.join(__dirname, '../uploads', coleccion, modelo.img )
        if ( fs.existsSync( pathImg ) ) {
            fs.unlinkSync( pathImg )
        }
    }

    const nombre = await subirArchivo( req.files, undefined, coleccion )
    modelo.img = nombre;

    await modelo.save();

    res.json( modelo )

}

const actualizarImgCloudinary = async (req, res = response) => {

    const { id, coleccion } = req.params;

    let modelo;
    switch ( coleccion ) {
        case 'usuarios':

            modelo = await Usuario.findById(id).exec()
            if ( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                })
            }

            break;
        case 'productos':

            modelo = await Producto.findById(id).exec()
            if ( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                })
            }

            break;
        default:
            return res.status(500).json({ msg: 'Se me olvido validar esto' })
    }

    // Limpiar imagenes previas
    if ( modelo.img ) {

        const nombreArr = modelo.img.split('/')
        const nombre    = nombreArr[ nombreArr.length - 1 ]
        const [ public_id ] = nombre.split('.')
        cloudinary.uploader.destroy( public_id )

    }

    const { tempFilePath } = req.files.archivo
    const { secure_url } = await cloudinary.uploader.upload( tempFilePath )

    modelo.img = secure_url

    await modelo.save();

    res.json( modelo )

}

const mostrarImagen = async (req, res = response) => {

    const { id, coleccion } = req.params;

    let modelo;
    switch ( coleccion ) {
        case 'usuarios':

            modelo = await Usuario.findById(id).exec()
            if ( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                })
            }

            break;
        case 'productos':

            modelo = await Producto.findById(id).exec()
            if ( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                })
            }

            break;
        default:
            return res.status(500).json({ msg: 'Se me olvido validar esto' })
    }

    // Limpiar imagenes previas
    if ( modelo.img ) {
        const pathImg = path.join(__dirname, '../uploads', coleccion, modelo.img )
        if ( fs.existsSync( pathImg ) ) {
            return res.sendFile( pathImg )
        }
    }

    const pathNotImg = path.join( __dirname, '../assets/no-image.jpg' )
    res.sendFile ( pathNotImg )

}

module.exports = { cargarArchivo, actualizarImagen, mostrarImagen, actualizarImgCloudinary }