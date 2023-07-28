import { User, UserModel } from "./../models/User";
import { Trip, TripModel, Timeline } from "./../models/Trip";
import { NextFunction, Request, Response } from "express";
import winston from "winston";
import { getIOConnection } from "../helpers/io";
import { groupBy, pick } from "lodash";
import * as _ from "lodash";
import { Error } from "mongoose";
const { Expo } = require("expo-server-sdk");
const expo = new Expo();

const moment = require("moment");
const mongoose = require('mongoose')
// eslint-disable-next-line prefer-const
let savedPushTokens: any[] = [];

type Message = {
  title: string;
  body: string;
};


const handlePushTokens = (message: Message)  => {
  const notifications = [];
  for (const pushToken of savedPushTokens) {
    if (!Expo.isExpoPushToken(pushToken)) {
      console.error(`Push token ${pushToken} is not a valid Expo push token`);
      continue;
    }

    notifications.push({
      to: pushToken,
      sound: "default",
      title: message.title,
      body: message.body,
      data: { message }
    });
  }

  const chunks = expo.chunkPushNotifications(notifications);

  (async () => {
    for (const chunk of chunks) {
      try {
        const receipts = await expo.sendPushNotificationsAsync(chunk);
        console.log(receipts);
      } catch (error) {
        console.error(error);
      }
    }
  })();
};

const saveToken = (token: any) => {
  console.log(token, savedPushTokens);
  const exists = savedPushTokens.find(t => t === token);
  if (!exists) {
    savedPushTokens.push(token);
  }
};

export const expoToken = (req: Request & any, res: Response): void => {
  saveToken(req.body.token.value);
  if (req.body.token.value) {
    const agent = req.payload.user;
    const user = new User();
    user.deviceToken = req.body.token.value;

    User.updateOne({ _id: agent._id }, user, { new: true })
        .exec()
        .then((user: UserModel) => {
            res.status(200).json( user );
        })
        .catch((err: any) => {
            return res.status(500).json({ error: err, message: "Error al editar usuario" }).end();
        });
  }
  console.log(`Received push token, ${req.body.token.value}`);
  res.send(`Received push token, ${req.body.token.value}`);
};

export const tripMessage = (req: Request & any, res: Response): void => {
  handlePushTokens(req.body);
  console.log(`Received message, with title: ${req.body.title}`);
  res.send(`Received message, with title: ${req.body.title}`);
};
export const testIO = async (req: Request & any, res: Response): Promise<any> => {
    const io = getIOConnection();
    console.log("test io");
    io.emit("updatedTrip", "success");
    res.status(200).send({ menssage: "Success io conexion"});
};

export const createTrip = async (req: Request & any, res: Response): Promise<any> => {
    const io = getIOConnection();
    const timeLine = {
        fulldate: new Date(),
        description: "Tarea creada",
        status: "Creado",
        user: req.payload.user._id
    };
    const preTrip = req.body;
    preTrip["timeline"] = [timeLine];

    const trip = new Trip(preTrip);
    const company = req.payload.user.company;
    trip.company = company;
    /* if (trip.status === "Asignado") {
        console.log('add trip agent to change status', trip.agents[0]);
        await User.updateOne({ _id: trip.agents[0] }, { status: "Ocupado"}, { new: true }).exec();
        io.emit("updatedAgent", "success");
    } */
    trip
      .save()
      .then((trip: TripModel) => {
        io.emit("updatedTrip", "success");
          res.json(trip).end();
        })
      .catch((err: Error) => {
        return res.status(500).json({ error: err, message: "Error al crear tarea" });
      });

};


export const getTrips = (req: Request & any, res: Response): void => {
    const $gte = moment().startOf("day").toDate(); // set to 12:00 am today
    const $lte = moment().endOf("day").toDate(); // set to 23:59 pm today
    const company = req.payload.user.company;
    const params = {createdAt: { $gte, $lte }};
    Trip.find({ company })
        .sort({ createdAt: -1 })
        .populate({
            path: "pickUp",
            populate: { path: "customer" }
        })
        .populate({
            path: "delivery",
            populate: { path: "customer" }
        })
        .populate({
            path: "agents",
            populate: { path: "agents" }
        })
        /* .populate({
            path: "teams",
            populate: { path: "teams" }
        }) */
        .populate("team")
        .populate({
            path: "timeline",
            populate: { path: "user" }
        })
        .sort({createdAt: -1})
        .exec()
        .then((trips: TripModel[]) => res.json(trips).end())
        .catch((err: Error) => {
            res.status(500).json({ error: err });
        });

};

export const getCoutByStatus = (req: Request & any, res: Response) => {

    const company = req.payload.user.company;
    const agent = req.payload.user;

    Trip
        .find({ company, agents: { $in: [ agent._id ]}})
        .exec()
        .then((trips: TripModel[]) => {
            const group: any = _.groupBy(trips, "status");
            const data = Object.keys(group).map(element => {
                const newObj = {
                    status: element,
                    count: _.countBy(group[element], "length")
                };
                return newObj;
            });
            res.json(data).end();
        })
        .catch((err: any) => {
            console.log(err);
            return res.status(500).json({ error: "Error al devolver valores" });
        });
};

export const getFilteredTrips = (req: Request & any, res: Response): void => {
    const company = req.payload.user.company;
    const agent = req.payload.user;
    const params: any = _.pick(req.query, ["user"]);
    params.company = company;
    Trip
        .find({ company: company, agents: { $in: [ agent._id ]}})
        .sort({ createdAt: -1 })
        .populate({
            path: "pickUp",
            populate: { path: "customer" }
        })
        .populate({
            path: "delivery",
            populate: { path: "customer" }
        })
        .populate({
            path: "agents",
            populate: { path: "agents" }
        })
        .populate("team")
        .populate({
            path: "timeline",
            populate: { path: "user" }
        })
        .sort({createdAt: -1})
        .exec()
        .then((trips: TripModel[]) => {
            res.json(trips).end();
        })
        .catch((err: Error) => {
            res.status(500).json({ error: err });
        });
};

export const getTripsMobile = (req: Request & any, res: Response): void => {

    const company = req.payload.user.company;
    const status = req.query.status;
    const perPage = +req.query.per_page;
    const page = +req.query.page;
    const skip = page * perPage;
    Trip.find({ company: company, status: status })
        .sort({ createdAt: -1 })
        .populate({
            path: "pickUp",
            populate: { path: "customer" }
        })
        .populate({
            path: "delivery",
            populate: { path: "customer" }
        })
        .populate({
            path: "agents",
            populate: { path: "agents" }
        })
        .populate("team")
        .populate({
            path: "timeline",
            populate: { path: "user" }
        })
        .sort({createdAt: -1})
        // .skip(skip)
        .limit(perPage)
        .exec()
        .then((trips: TripModel[]) => {
            res.json(trips).end();
        })
        .catch((err: Error) => {
            res.status(500).json({ error: err });
        });
};

export const getTripsToday = (req: Request & any, res: Response): void => {
    const $gte = moment().startOf("day").toDate(); // set to 12:00 am today
    const $lte = moment().endOf("day").toDate(); // set to 23:59 pm today
    const company = req.payload.user.company;
    
    const params = { company };
    // const params = { createdAt: { $gte, $lte }, company};
    Trip.find(params)
        .sort({ createdAt: -1 })
        .populate({
            path: "pickUp",
            populate: { path: "customer" }
        })
        .populate({
            path: "delivery",
            populate: { path: "customer" }
        })
        .populate({
            path: "agents",
            populate: { path: "agents" }
        })
        /* .populate({
            path: "teams",
            populate: { path: "teams" }
        }) */
        .populate("team")
        .populate({
            path: "timeline",
            populate: { path: "user" }
        })
        .sort({createdAt: -1})
        .exec()
        .then((trips: TripModel[]) => {
            const groupedByStatus = groupBy(trips, "status");
            const index = {
                "Sin asignar": pick(groupedByStatus, ["Sin asignar"]),
                "Asignado": pick(groupedByStatus, ["Asignado", "En progreso"]),
                "Terminado": pick(groupedByStatus, ["Cancelado", "Fallido", "Completado"]),
            };
            res.json(index).end();
        })
        .catch((err: Error) => {
            res.status(500).json({ error: err });
        });

};

export const getTripByStatus = (req: Request & any, res: Response): void => {
    const company = req.payload.user.company;
    const status = req.params.status;
    const $gte = moment().startOf("day").toDate(); // set to 12:00 am today
    const $lte = moment().endOf("day").toDate(); // set to 23:59 pm today
    // ! const params = { createdAt: { $gte, $lte }, company, status};
    const params = { company, status };
    Trip
        .find(params)
        .exec()
        .then((trips: TripModel[]) => {
            res.status(200).send(trips);
        })
        .catch((err: any) => res.status(500).json({ error: err }));
};

export const getPerAgent = (req: Request & any, res: Response): void => {
    const agent = req.payload.user;
    const company = agent.company;
    const $gte = moment().startOf("day").toDate(); // set to 12:00 am today
    const $lte = moment().endOf("day").toDate(); // set to 23:59 pm today
    // ! const params = { createdAt: { $gte, $lte }, company, status};
    Trip
        .find({
            company,
            agents: { $in: [ agent._id ]}
        })
        .populate({
            path: "pickUp",
            populate: { path: "customer" }
        })
        .populate({
            path: "delivery",
            populate: { path: "customer" }
        })
        .populate({
            path: "agents",
            populate: { path: "agents" }
        })
        .populate("team")
        .populate({
            path: "timeline",
            populate: { path: "user" }
        })
        .exec()
        .then((trips: TripModel[]) => {
            res.status(200).send(trips);
        })
        .catch((err: any) => res.status(500).json({ error: err }));
};

export const getMyTrip = (req: Request, res: Response, next: NextFunction): void => {

    const id = req.params.id;

    Trip
        .findById(id)
        .exec()
        .then((trip: TripModel) => {
            res.status(200).send({ trip });
        })
        .catch((err: Error) => {
            winston.error(req.path, { body: req.body, headers: req.headers, error: err.message });
            if (err) { return next(err); }
            return res.status(500).json({ error: "server_error" }).end();
        });
};
export const removeTrip = (req: Request, res: Response, next: NextFunction): void => {

    Trip.remove({ _id: req.params.id }, (err) => {
        if (err) { return next(err); }
        res.status(200).send({ response: "Registro eliminado" });
    });

};
export const tripUpdate = (req: Request & any, res: Response): void => {

    const tripId = req.params.id;
    // const user = req.payload.user;
    const trip = req.body;
    // const io = getIOConnection();

    // const timeline: Timeline = {
    //     fulldate: new Date().toString(),
    //     status: "Actualizado",
    //     description: "Actualizado por administrador",
    //     user: user._id,
    // };
    // trip.timeline = trip.timeline.concat(timeline);
    Trip
        .updateOne({ _id: tripId }, trip, { new: true })
        .exec()
        .then((updateTrip: TripModel) => {
            // io.emit("updatedTrip", "success");
            res.status(200).json( updateTrip );
        })
        .catch(err => res.status(500).json({ error: err, message: "Error al actualizar tarea" }).end());
};

// * Cambiar el estado de una tarea a admitida.
export const admitTrip = (req: Request & any, res: Response): void => {
    const io = getIOConnection();
    const agent = req.payload.user;
    const tripId = req.params.id;
    const trip = req.body;
    const timeline = {
        fulldate: new Date(),
        description: "Tarea admitida",
        user: req.payload.user._id,
        status: "Admitido"
    };
    trip.agents = trip.agents ? trip.agents.concat(agent._id) : [agent._id];
    trip.team = agent.team ? agent.team._id : null;
    trip.status = "Asignado";
    trip.timeline = trip.timeline.concat(timeline);
    Trip
        .updateOne({_id: tripId}, trip, { new: true })
        .exec()
        .then((resuls) => {
            io.emit("updatedTrip", "success");
            User
                .updateOne({ _id: agent._id }, { status: "Ocupado"}, { new: true })
                .exec()
                .then((results2) => {
                    io.emit("updatedAgent", "success");
                    res.status(200).send(trip);
                })
                .catch((err) => res.status(500).send({ message: "Error al cambiar estado del agente", err}));
        })
        .catch((err) => res.status(500).send({message: "Error al admitir tarea por agente", err}));
};

export const startTrip = (req: Request & any, res: Response): void => {
    // todo Agregar la direccion del momento en que se inicia la tarea.
    const io = getIOConnection();
    const agent = req.payload.user;
    const tripId = req.params.id;
    const trip = req.body;
    const timeline = {
        fulldate: new Date(),
        description: "Tarea iniciada en progreso",
        user: agent._id,
        status: "Comenzado",
    };
    trip.status = "En progreso";
    trip.timeline = trip.timeline.concat(timeline);
    Trip
        .updateOne({_id: tripId}, trip, { new: true })
        .exec()
        .then(async (resuls) => {
            await User.updateOne({ _id: trip.agents[0]._id }, { status: "Ocupado" }, {new: true}).exec();
            io.emit("updatedTrip", "success");
            io.emit("updatedAgent", "success");
            res.status(200).send(trip);
        })
        .catch((err) => res.status(500).send({message: "Error al comenzar tarea por agente", err}));
};

export const finishTrip = (req: Request & any, res: Response): void => {
    // todo Agregar la direccion del momento en que se inicia la tarea.
    const io = getIOConnection();
    const agent = req.payload.user;
    const tripId = req.params.id;
    const trip = req.body;
    const timeline = {
        fulldate: new Date(),
        description: "Tarea finalizada",
        user: agent._id,
        status: "Finalizado",
    };
    trip.agents[0].status = "Libre";
    trip.status = "Completado";
    trip.timeline = trip.timeline.concat(timeline);
    Trip
        .updateOne({_id: tripId}, trip, { new: true })
        .exec()
        .then(async (resuls) => {
            await User.updateOne({ _id: trip.agents[0]._id }, { status: "Libre" }, {new: true}).exec();
            io.emit("updatedTrip", "success");
            io.emit("updatedAgent", "success");
            res.status(200).send(trip);
        })
        .catch((err) => res.status(500).send({message: "Error al finalizar tarea por agente", err}));
};

export const updateTripStatus = (req: Request & any, res: Response): void => {
    const io = getIOConnection();
    const agent = req.payload.user;
    const tripId = req.params.id;
    const status = req.query.status;
    const descriptions: any = {
        Asignado: "Agente asignado a la tarea",
        "En progreso": "Tarea iniciada en progreso",
        Cancelado: "Tarea cancelada",
        Fallido: "Tarea fallida",
        Completado: "Tarea completada"
    };
    const timeline = {
        fulldate: new Date(),
        description: descriptions[status],
        user: agent._id,
        status: status,
    };
};


export const newTrip = (req: Request & any, res: Response): void => {
    const timeLine = {
        fulldate: new Date(),
        description: "Tarea creada",
        status: "Creado",
        user: req.payload.user._id
    };
    const preTrip = req.body;
    preTrip["timeline"] = [timeLine];

    const trip = new Trip(preTrip);
    const company = req.payload.user.company;
    trip.company = company;
    trip
    .save()
    .then((newTrip: TripModel) => {
        const idTrip = new mongoose.Types.ObjectId(newTrip._id)
        User.updateOne({_id: req.payload.user._id}, {$push: { trips: [idTrip]}})
        .then((userUpdate: UserModel) => {
            res.status(200).send(newTrip).end();
        })
        .catch((err:Error) => {
            res.status(500).send(err).end()
        })
    }).catch( (err:Error) => {
        res.status(500).send(err).end()
    })

}

export const getAllTrips = (req: Request & any, res: Response): void => {
    Trip
        .find({status: 'Sin asignar'})
        .populate('addressA')
        .populate('addressB')
        .populate({
            path: "timeline",
            populate: { path: "user" }
        })
        .exec()
        .then( (tripsResult: TripModel[]) => {
            res.status(200).send(tripsResult).end();
        })
        .catch( error => {
            res.status(500).send({error}).end();
        })
        
}

export const getTripsAgent = (req: Request & any, res: Response): void => {
    Trip
        .find({status: 'Asignado'})
        .populate('addressA')
        .populate('addressB')
        .populate('user')
        .populate({
            path: "timeline",
            populate: { path: "user" }
        })
        .exec()
        .then( (tripsResult: TripModel[]) => {
            res.status(200).send(tripsResult).end();
        })
        .catch( error => {
            res.status(500).send({error}).end();
        })
        
}

export const newTripAgent = (req: Request & any, res: Response): void => {

    const company = req.payload.user.company;
    const idUser = new mongoose.Types.ObjectId(req.payload.user._id)
    const trip = new Trip(req.body);
    trip.company = company;
    trip.status = "Asignado";
    trip.user = idUser

    trip
    .save()
    .then((newTrip: TripModel) => {
        const idTrip = new mongoose.Types.ObjectId(newTrip._id)
        User.updateOne({_id: req.payload.user._id}, {$push: { trips: [idTrip]}})
        .then((userUpdate: UserModel) => {
            res.status(200).send(newTrip).end();
        })
        .catch((err:Error) => {
            res.status(500).send(err).end()
        })
    }).catch( (err:Error) => {
        res.status(500).send(err).end()
    })

}

export const updateAssingAgent = (req: Request & any, res: Response) => {

    const { id } = req.params
    const user = new mongoose.Types.ObjectId(req.payload.user._id)
    const trip = {...req.body, user, status: 'Asignado'}

    Trip
    .updateOne({ _id: id }, trip, { new: true })
    .exec()
    .then((updateTrip: TripModel) => {
        const idTrip = new mongoose.Types.ObjectId(updateTrip._id)
        User.updateOne({_id: req.payload.user._id}, {status: 'Ocupado', $push: { trips: [idTrip]}})
        .then((userUpdate: UserModel) => {
            res.status(200).json({ updateTrip }).end();
        })
        .catch((err:Error) => {
            res.status(500).send(err).end();
        })
    })
    .catch(err => res.status(500).json({ error: err, message: "Error al actualizar tarea" }).end());

}

export const getTrip = (req: Request, res: Response) => {
    const { id } = req.params

    Trip
        .findById(id, {code:0,createdAt:0,updatedAt:0})
        .populate('addressA')
        .populate('addressB')
        .populate('user',['-preferences','-trips','-salt','-password','-updatedAt','-createdAt'])
        .populate('company')
        .populate('vehicle')
        .populate({
            path: "timeline",
            populate: { path: "user" }
        })
        .exec()
        .then((trip: TripModel) => {
            res.status(200).send(trip).end();
        })
        .catch((err: Error) => {
            res.status(500).json({ error: "server_error" }).end();
        });

}
