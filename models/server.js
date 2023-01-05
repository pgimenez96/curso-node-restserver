const express = require('express');
const cors = require('cors');

const { dbConnection } = require('../database/config');

class Server {

    constructor() {
        // Instancia de express
        this.app = express();
        this.userPath = '/api/usuarios';
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
    }

    routes() {

        this.app.use(this.userPath, require('../routes/user'));

    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en el puerto ', this.port);
        });
    }

}

module.exports = Server;
