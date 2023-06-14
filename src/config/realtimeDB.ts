import { User } from './../models/User';
import { NextFunction } from "express";
import { Server, Socket } from "socket.io";
import { setIOConnection } from "../helpers/io";
const jwt = require("jsonwebtoken");
import server from "../server";
const io: Server = new Server(server, {
    cors: {
      origin: true,
      credentials: true,
      methods: ['GET', 'POST']
    }
});

// io.use((socket: any, next: NextFunction) => {
    // console.log("IN USE CONNECTION");
    // next();
    /* if (socket.handshake.query && socket.handshake.query.token){
      jwt.verify(socket.handshake.query.token, process.env.SECRET_KEY, (err: any, decoded: any) => {
        if (err) return next(new Error("Authentication error"));
        socket.decoded = decoded;
        next();
      });
    }
    else {
      next(new Error("Authentication error"));
    }     */
// });

// * -----------------------------  E V E N T O S ---------------------------
io.on("connection", (socket: Socket) => {
    console.log("\n-------------------------------------------------------");
    console.log("SOCKET IO SUCCESS CONNECTION SUCCESS: ", socket.id);
    console.log("--------------------------------------------------------\n");
    
    socket.emit('id-socket', socket.id)
    
    socket.on('request-trip', (id) => {
        socket.broadcast.to(id).emit('new-request-trip')
    })
    
    socket.on('accept-trip', (id) => {
        socket.broadcast.to(id).emit('accept-trip-agent')
    })

    socket.on("disconnect", (err: any) => {
        console.log("\nxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
        console.log("SOCKET IO DISCONNECT CONNECTION SUCCESS: ", socket.id);
        console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx\n");

        User.find({ idSocket: socket.id },{idSocket: ''})
        .then( res => {
            socket.broadcast.emit('user-disconnect' )
        })
    })
});

io.on("error", (err: any) => {
    console.log("\nxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
    console.log("SOCKET IO ERROR CONNECTION SUCCESS: ", err);
    console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx\n");
});

io.on("disconnect", (err: any) => {
    console.log("\nxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
    console.log("SOCKET IO DISCONNECT CONNECTION SUCCESS: ", err);
    console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx\n");
});

setIOConnection(io);

/* socketIO.use((socket: any, next: NextFunction) => {
    if (socket.handshake.query && socket.handshake.query.token){
      jwt.verify(socket.handshake.query.token, process.env.SECRET_KEY, (err: any, decoded: any) => {
        if (err) return next(new Error("Authentication error"));
        socket.decoded = decoded;
        next();
      });
    }
    else {
      next(new Error("Authentication error"));
    }    
  })
  .on("connection", (socket: Socket) => {
    console.log("\n-------------------------------------------------------");
    console.log("SOCKET IO SUCCESS CONNECTION SUCCESS: ", socket.id);
    console.log("--------------------------------------------------------\n");
    
    // * Proceso de actualizacion del estado de una tarea.
    socket.on("updatedTask", (data: any) => {
        const task = data.task;
        task.status = data.status;
        if (task.status === "Completada") {
            const timeline = {
                fulldate: new Date().toString(),
                status: "Finalizado",
                // user: user._id,
            };
            task.timeline = task.timeline.concat(timeline);
        }
        Task.updateOne({ _id: task._id }, task, { new: true })
        .exec()
        .then((doc: TaskModel) => {   
            socket.emit("updatedTask", "success");
        })
        .catch((err) => socketIO.sockets.emit("updateStatusTask", { message: "error", err }));
    });

    // * Actualizacion de la linea de tiempo de una tarea.
    socket.on("updateTimeline", (data: any) => {
        const task = data.task;
        const timeline = data.timeline;
        Task
            .findOne({_id: task})
            .exec()
            .then(task => {
                task.timeline.push(timeline);
                Task
                    .updateOne({_id: task}, task, { new: true })
                    .exec()
                    .then(result => {
                        console.log("timeline agregado", result);
                        socket.emit("socketUpdateTimeline", {status: "success", result: task});
                    }).catch(err => {
                        console.error("Error al agregar timeline", err);
                    });
            })
            .catch(err => console.error("Error al obtener tarea para agregar timeline", err));
       
        socketIO.sockets.emit("updateTimeline", "success");
    });
}); */
// export default socketIO;


/* io.sockets
    .on('connection', socketioJwt.authorize({
        secret: process.env.SECRET_KEY,
        timeout: 15000 // 15 seconds to send the authentication message
    })).on('authenticated', (socket: any) => {
        //this socket is authenticated, we are good to handle more events from it.
        console.log(`Hello! ${socket.decoded_token.name}`);
    }); */
/* io.sockets.on("connection", (socket: any) => {
    console.log("\n-------------------------------------------------------");
    console.log("SOCKET IO SUCCESS CONNECTION SUCCESS: ", socket.id);
    console.log("--------------------------------------------------------\n");
    
    // * Proceso de actualizacion del estado de una tarea.
    socket.on("updateStatusTask", (data: any) => {
        const task = data.task;
        task.status = data.status;
        if (task.status === "Completada") {
            const timeline = {
                fulldate: new Date().toString(),
                status: "Finalizado",
                // user: user._id,
            };
            task.timeline = task.timeline.concat(timeline);
        }
        Task.updateOne({ _id: task._id }, task, { new: true })
        .exec()
        .then((doc: TaskModel) => {   
            socket.emit("updateStatusTask", "success");
        })
        .catch((err) => io.sockets.emit("updateStatusTask", { message: "error", err }));
    });

    // * Actualizacion de la linea de tiempo de una tarea.
    socket.on("updateTimeline", (data: any) => {
        const task = data.task;
        const timeline = data.timeline;
        Task
            .findOne({_id: task})
            .exec()
            .then(task => {
                task.timeline.push(timeline);
                Task
                    .updateOne({_id: task}, task, { new: true })
                    .exec()
                    .then(result => {
                        console.log("timeline agregado", result);
                        socket.emit("socketUpdateTimeline", {status: "success", result: task});
                    }).catch(err => {
                        console.error("Error al agregar timeline", err);
                    });
            })
            .catch(err => console.error("Error al obtener tarea para agregar timeline", err));
       
        io.sockets.emit("updateTimeline", "success");
    });
}); */