const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 4000;
const dbConnect = require('./config/dbConnect');
const authRouter = require('./routes/authRoutes');
const productRouter = require('./routes/productRoutes');
const orderRouter = require('./routes/orderRoutes'); 
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');

// Connect to the database
dbConnect();

// Serve static files
app.use('/static', express.static(path.join(__dirname, '/upload/images')));

// Middleware
app.use(cookieParser());
const allowedOrigins = [
    'http://localhost:5173', 
    'https://a-kart-frontend.onrender.com' 
  ];
  
  app.use(cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true
  }));
app.options('*', cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
    console.log('Cookies:', req.cookies);
    next();
});


// Route handlers
app.use('/auth', authRouter);
app.use('/product', productRouter);
app.use('/order', orderRouter); 

// Start the server
app.listen(PORT, (error) => {
    if (!error) {
        console.log(`Server is running at port ${PORT}`);
    } else {
        console.log('Error: ' + error);
    }
});
