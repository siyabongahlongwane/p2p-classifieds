const path = require('path');
const dotenv = require('dotenv');

// Load .env file based on environment
const env = process.env.NODE_ENV || 'development';
const envFile = env === 'production' ? '.env.production' : '.env.local';

// Load the correct .env file
dotenv.config({ path: path.resolve(__dirname, `./${envFile}`) });

const express = require("express");
const cors = require("cors");

const session = require("express-session");
const passport = require("./utils/passport");

const app = express();
const db = require('./db_models');

const corsOptions = {
  origin: ['http://classifieds.schoolthrifties.co.za', 'https://classifieds.schoolthrifties.co.za', 'http://localhost:5173'],
  methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'DELETE']
}

const PORT = process.env.PORT || 5001;

const { Op } = require('sequelize');

app.use(express.json({ limit: 10000 }));
app.use(express.urlencoded({ extended: true }));


// app.use(cors(corsOptions));
app.use(cors({origin: '*'}));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.session());
app.use(passport.initialize());

(async () => {
  await db.sequelize.sync({ alter: true, force: false });
  console.log("Database synced successfully");
})();

// Classifieds Routes
app.use("/api/classifieds", require('./routes'));

app.get('/api/classifieds/search', async (req, res) => {
  const { query } = req.query;
  console.log('QUERY', query);

  try {


    const products = await db.models.Product.findAll({
      where: {
        [Op.or]: [
          {
            title: {
              [Op.like]: `%${query}%`,
            },
          },
          {
            description: {
              [Op.like]: `%${query}%`,
            },
          },
        ],
        status: 'Available'
      },
      include: [{
        model: db.models.ProductPhoto,
        as: 'photos',
        attributes: ['photo_id', 'photo_url']
      }]
    });

    const shops = await db.models.Shop.findAll({
      where: {
        name: {
          [Op.like]: `%${query}%`,
        },
      },
      include: [{
        model: db.models.Product,
        as: 'products',
        // attributes: ['product_id']
        include: [
          {
            model: db.models.ProductPhoto,
            as: 'photos',
            // attributes: ['photo_id', 'photo_url'] // Select only required fields
          }
        ]
      }]
    });


    res.status(200).json({
      products,
      shops,
    });
  } catch (error) {
    console.error('Error occurred while searching:', error);
    res.status(500).json({ error: 'An error occurred while searching' });
  }
});

module.exports = { app, PORT, db };