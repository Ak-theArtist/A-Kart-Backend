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
app.use('/upload/images', express.static(path.join(__dirname, 'upload/images')));

// Middleware
app.use(cookieParser());
app.use(cors({
    origin: 'https://a-kart-frontend.onrender.com',
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
}));
app.options('*', cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
