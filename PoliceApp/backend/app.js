const express = require("express");
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const passport = require("passport");
const localStrategy = require("passport-local");
const dotenv = require('dotenv');
const Police = require('./models/police');
const session = require("express-session");
const mongoStore = require("connect-mongo");

const { UserSchema , ReportSchema } = require("shared-models");

const http = require("http");
const socketIo = require("socket.io");
const AlertServer = http.createServer(app);
const io = socketIo(AlertServer, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"]
  }
});
io.on("connection", (socket) => {
  console.log("Client connected via socket");

  // socket.on("disconnect", () => {
  //   console.log("Client disconnected");
  // });
});

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

dotenv.config();

const store = mongoStore.create({
    mongoUrl:process.env.MONGO_URI,
    crypto:{
        secret:process.env.SECRET_KEY
    },
    touchAfter:24*3600,
});

app.use(session({ 
    store,
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 7*24*60*60*1000, 
        secure: process.env.NODE_ENV === "production",        
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
    }
}));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const User = mongoose.models.User || mongoose.model("User", UserSchema);
module.exports.User = User;
const Report = mongoose.models.Report || mongoose.model("Report", ReportSchema);
module.exports.Report = Report;

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