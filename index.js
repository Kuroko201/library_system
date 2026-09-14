// index.js
const express = require('express');
const path = require('path');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const {Pool} =require('pg')
const con=new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432', 10), 
})
con.connect().then(()=>{
  console.log("Connected to pg")
}) .catch(err => console.error('DB connection failed:', err.message));
const app = express();
const PORT = process.env.PORT || 8080;
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});