const express = require('express')
const mongoose = require('mongoose')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')

require('dotenv/config')

// MIDDLEWARES
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
// app.use(bodyParser.raw());
app.use(cors())

// ROUTES
const postsRoute = require('./routes/posts');
app.use('/posts', postsRoute)

//ROUTES
app.get('/', (req, res) => {
    res.send('We are on home')
})

// { useNewUrlParser: true, useUnifiedTopology: true }

mongoose.connect(process.env.DB_CONNECTION,
    { useNewUrlParser: true, useUnifiedTopology: true }
)
.catch(error => console.log(error));

app.listen(3000)