const dotenv = require('dotenv');

// Determine the environment and load the corresponding .env file
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
dotenv.config({ path: envFile });

const express = require("express");
const cors = require("cors");

const session = require("express-session");
const passport = require("./utils/passport");

const app = express();
const db = require('./db_models');

const corsOptions = {
  origin: ['https://schoolthrifties.co.za', 'https://schoolthrifties.co.za', 'http://localhost:5173', 'https://mmnptfmf-5173.inc1.devtunnels.ms'],
  methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'DELETE']
}

const PORT = process.env.PORT || 5001;

app.use(express.json({ limit: 10000 }));
app.use(express.urlencoded({ extended: true }));


app.use(cors({origin: '*'}));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.session());
app.use(passport.initialize());

(async () => {
  await db.sequelize.sync({ alter: false });
  console.log("Database synced successfully");
})();

// Classifieds Routes
app.use("/api/classifieds", require('./routes'));

module.exports = { app, PORT, db };