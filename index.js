const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);



const WebSocket = require('ws');
const pricesUrl = 'wss://ws.coincap.io/prices?assets=bitcoin,ethereum,litecoin,dogecoin,ripple'

const cron = require('node-cron');

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


io.once('connection', function(socket){
    const pricesWs = new WebSocket(pricesUrl)
    pricesWs.onmessage = function (msg) {
        let priceData = JSON.parse(msg.data)
        //socket.emit('request', priceData = priceData); // emit an event to the socket when 'request' comes through
        io.emit('broadcast', priceData);
        console.log(socket.id)
    }
    
});

//CRON JOB: 

// cron.schedule('*/5 * * * * *', () => {
//     
// });

//CONNECT TO DB
mongoose.connect(
    process.env.DB_CONNECTION, 
    { useNewUrlParser: true }, 
    () => {console.log('Connected to database.')
});

app.listen('3005', () => console.log('Listening on port 3005.'))
server.listen('80', () => console.log('Listening on port 80.'));