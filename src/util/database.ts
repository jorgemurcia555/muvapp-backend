const bluebird = require("bluebird");
const mongoose = require("mongoose");

const mongoUrl = "mongodb://localhost/muvex";
mongoose.Promise = bluebird;
mongoose
    .connect(mongoUrl, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true } )
    .then(() => console.log("MongoDB connected"))
    .catch((err: any) => console.log(`MongoDB connection error. Please make sure MongoDB is running. ${err}`));
export default mongoose;
