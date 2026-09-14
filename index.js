// index.js
const express = require('express');
const path = require('path');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const {Pool} =require('pg')
const con=new Pool({
  host:'localhost',
  user:'postgres',
  port: 5432,
  password: "15975321",
  database: "library system"
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