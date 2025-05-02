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

const prodCorsOptions = {
  origin: ['http://classifieds.schoolthrifties.co.za', 'https://classifieds.schoolthrifties.co.za'],
  methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'DELETE']
}

const corsOptions = env === 'production' ? prodCorsOptions : { origin: '*' }

const PORT = process.env.PORT || 5001;

const { Op } = require('sequelize');

app.use(express.json({ limit: 10000 }));
app.use(express.urlencoded({ extended: true }));


// app.use(cors(corsOptions));
app.use(cors(corsOptions));

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
  const categories = await db.models.Category.count();

  if (!categories) {
    await db.models.Category.bulkCreate([
      {
        category_id: 1,
        title: 'School Items',
        createdAt: new Date('2024-11-01T12:10:49.000Z'),
        updatedAt: new Date('2024-11-01T14:10:26.000Z')
      },
      {
        category_id: 2,
        title: 'Civvies',
        createdAt: new Date('2024-11-01T12:10:49.000Z'),
        updatedAt: new Date('2024-11-01T12:10:49.000Z')
      },
      {
        category_id: 3,
        title: 'Tops',
        createdAt: new Date('2024-11-01T12:10:49.000Z'),
        updatedAt: new Date('2024-11-01T12:10:49.000Z')
      },
      {
        category_id: 4,
        title: 'Jerseys',
        createdAt: new Date('2024-11-01T12:10:49.000Z'),
        updatedAt: new Date('2024-11-01T12:10:49.000Z')
      },
      {
        category_id: 5,
        title: 'Jackets',
        createdAt: new Date('2024-11-01T12:10:49.000Z'),
        updatedAt: new Date('2024-11-01T12:10:49.000Z')
      },
      {
        category_id: 6,
        title: 'Bottoms',
        createdAt: new Date('2024-11-01T12:10:49.000Z'),
        updatedAt: new Date('2024-11-01T12:10:49.000Z')
      },
      {
        category_id: 7,
        title: 'Shoes',
        createdAt: new Date('2024-11-01T12:10:49.000Z'),
        updatedAt: new Date('2024-11-01T12:10:49.000Z')
      },
      {
        category_id: 8,
        title: 'Textbooks',
        createdAt: new Date('2024-11-01T12:10:49.000Z'),
        updatedAt: new Date('2024-11-01T12:10:49.000Z')
      },
      {
        category_id: 9,
        title: 'Sports goods',
        createdAt: new Date('2024-11-01T12:10:49.000Z'),
        updatedAt: new Date('2024-11-01T12:10:49.000Z')
      },
      {
        category_id: 10,
        title: 'Other',
        createdAt: new Date('2024-11-01T12:10:49.000Z'),
        updatedAt: new Date('2024-11-01T12:10:49.000Z')
      }
    ]);
  }

  console.log('🌱 Categories seeded successfully!');
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