import express from "express";
import { Server } from "socket.io";
import __dirname from "./dirname.js";
import path from "path";

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, "../public")));


const httpServer = app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto http://localhost:${PORT}`);
});

//Socket IO
const io = new Server(httpServer);

const messages = [];

io.on("connection", (socket) => {
    console.log("Un usuario se ha conectado", socket.id);

    // manejo de los mensajes
    socket.on("message", (data) => {
        messages.push(data);
        io.emit("messages", messages);
    });

    // manejo cuando se conecta un nuevo usuario
    socket.on("inicio", (data) => {
        io.emit("inicio", data);
        socket.broadcast.emit("connected", data);
    })

    socket.emit("messages", messages);

    socket.on("disconnect", () => {
        console.log("Un usuario se ha desconectado", socket.id);
});

});