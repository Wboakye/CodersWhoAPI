const express = require('express');
const app = express();

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv/config');

//IMPORT ROUTES
const authRoute = require('./routes/auth');
const postsRoute = require('./routes/posts');

//MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

//ROUTES
app.use('/api/user', authRoute);
app.use('/api/posts', postsRoute);

//MAIN ENDPOINT
app.get('/', (req, res) => {
    res.send('CODERS WHO...');
});

//CONNECT TO DB
mongoose.connect(
    process.env.DB_CONNECTION, 
    { useNewUrlParser: true }, 
    () => {console.log('Connected to database.')
});

app.listen('3005', () => console.log('Listening on port 3005.'))