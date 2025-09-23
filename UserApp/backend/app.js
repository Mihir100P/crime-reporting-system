const express = require("express");
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const passport = require("passport");
const localStrategy = require("passport-local");
const dotenv = require('dotenv');
const User = require('./models/user');
const session = require("express-session");

const http = require("http");
const socketIo = require("socket.io");
const Server = http.createServer(app);
const io = socketIo(Server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials:true,
  }
});

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
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

const PORT = process.env.PORT || 5000;

Server.listen(PORT, () => {
  console.log(`Alert Server with Socket.IO running on port ${PORT}`);
});


app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy({ usernameField: 'email' }, User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use("/api/users",require("./routes/user"));
app.use("/api/reports",require("./routes/reports"));
app.use("/api/join",require("./routes/join"));
app.use("/api/sos",require("./routes/sosAlert"));

const onlineUsers = new Map();
io.on("connection", (socket) => {
  console.log("Client connected via socket",socket.id);

  socket.on("register-location", (location) => {
    onlineUsers.set(socket.id, { location });
  });

  socket.on("disconnect", () => {
    onlineUsers.delete(socket.id);
  });
});
const alertRoutes = require("./routes/alert")(io, onlineUsers);
app.use("/api/alerts", alertRoutes);
