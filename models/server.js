const express = require('express');
const cors = require('cors');

const { dbConnection } = require('../database/config');
const fileUpload = require('express-fileupload');

class Server {

    constructor() {
        // Instancia de express
        this.app = express();
        this.paths = {
            auth:       '/api/auth',
            buscar:     '/api/buscar',
            usuarios:   '/api/usuarios',
            categorias: '/api/categorias',
            productos:  '/api/productos',
            uploads:    '/api/uploads'
        }
        this.port = process.env.PORT || 3000;

        // Conectar a base de datos
        this.conectarDB();

        // Middlewares
        this.middlewares();

        // Rutas de mi aplicación
        this.routes();
    }

    async conectarDB() {
        await dbConnection();
    }

    middlewares() {
        // Cors
        this.app.use( cors()) ;

        // Lectura y paseo de body
        this.app.use( express.json() );

        // Directorio público
        this.app.use( express.static('public') );

        // FileUpload - Carga de archivo
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));

    }

    routes() {

        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.buscar, require('../routes/buscar'));
        this.app.use(this.paths.usuarios, require('../routes/user'));
        this.app.use(this.paths.categorias, require('../routes/categorias'));
        this.app.use(this.paths.productos, require('../routes/productos'));
        this.app.use(this.paths.uploads, require('../routes/uploads'));

    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en el puerto ', this.port);
        });
    }

}

module.exports = Server;
