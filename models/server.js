import express from "express";
import cors from "cors";
import http from 'http';
import {Server as socketServer } from 'socket.io';

import path from "path";
import { fileURLToPath } from "url";

import homeRouter from '../routes/home.js'
import clientsRouter from '../routes/clients.js'
import staffsRouter from '../routes/staff.js'
import authRouter from '../routes/auth.js'

import socketController from '../sockets/controller.js'

import database from "../connections/database.js";
import expressLayouts from "express-ejs-layouts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.server = http.createServer(this.app);
        this.io = new socketServer(this.server);
        this.paths = {
            home: '/',
            client: '/client',
            staff:  '/details',
            auth:  '/auth'
        };

        this.dbConnection();
        this.middlewares();
        this.layouts();
        this.routes();
        this.sockets();
    }

    async dbConnection() {
        try {
            await database.authenticate();
            console.log('Database online');
        } catch (error) {
            throw error;
        }
    }

    middlewares() {
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.static('public'));
    }

    routes() {
        this.app.use(this.paths.home, homeRouter);
        this.app.use(this.paths.client, clientsRouter);
        this.app.use(this.paths.staff, staffsRouter);
        this.app.use(this.paths.auth, authRouter);

        this.app.get('*', (req, res) => {
            res.sendFile(path.join(__dirname, '../public/errors', '404.html'));
        });
    }

    layouts() {
        this.app.use(expressLayouts);
        this.app.set('view engine', 'ejs');
    }

    sockets() {
        this.io.on('connection', (socket) => socketController(socket, this.io));
    }

    listen() {
        this.server.listen(this.port, () => {
            console.log(`Running on port ${this.port}`);
        });
    }
}

export default Server