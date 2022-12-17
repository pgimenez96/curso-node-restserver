const express = require('express');
const cors = require('cors');

class Server {

    constructor() {
        // Instancia de express
        this.port = process.env.PORT || 3000;
        this.app = express();
        this.userPath = '/api/usuarios';

        // Middlewares
        this.middlewares();

        // Rutas de mi aplicación
        this.routes();
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
