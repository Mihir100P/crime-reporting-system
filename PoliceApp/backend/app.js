const express = require("express");
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const passport = require("passport");
const localStrategy = require("passport-local");
const dotenv = require('dotenv');
const Police = require('./models/police');
const session = require("express-session");

const http = require("http");
const socketIo = require("socket.io");
const AlertServer = http.createServer(app);
const io = socketIo(AlertServer, {
  cors: {
    origin: "http://localhost:5174",
    methods: ["GET", "POST"]
  }
});
io.on("connection", (socket) => {
  console.log("Client connected via socket");

  // socket.on("disconnect", () => {
  //   console.log("Client disconnected");
  // });
});

app.use(cors({ origin: "http://localhost:5174", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

dotenv.config();

app.use(session({
    secret:process.env.SECRET_KEY,
    resave:false,
    saveUninitialized:true,
    cookie : {
        expires:Date.now() + 7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        secure: false,        
        httpOnly: true,
        sameSite: "lax" 
    }}));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5001;

AlertServer.listen(PORT, () => {
  console.log(`Alert Server with Socket.IO running on port ${PORT}`);
});


app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy({ usernameField: 'StationName' }, Police.authenticate()));
passport.serializeUser(Police.serializeUser());
passport.deserializeUser(Police.deserializeUser());

app.use("/api/police",require("./routes/police"));
app.use("/api/reports",require("./routes/reports"));
app.use("/api/trigger-alert",require("./routes/alertsend"));
app.use("/api/report-status",require("./routes/updatereport"));
app.use("/api/fetch-user",require("./routes/fetchuser"));