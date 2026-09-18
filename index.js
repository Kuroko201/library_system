// index.js
const express = require('express');
const path = require('path');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const {Pool} =require('pg')
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 12;
const pool=new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432', 10), 
})
pool.connect().then(()=>{
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

app.post('/register',async (req,res)=>{
  const { username, password } = req.body;

    if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  if (typeof username !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'Invalid input types' });
  }
  if (username.trim().length < 3 || username.length > 30) {
    return res.status(400).json({ error: 'Username must be 3–30 characters' });
  }
  if (password.length < 4) {
    return res.status(400).json({ error: `Password must be at least 4 characters` });
  }

  try {
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const result = await pool.query(
      `INSERT INTO users (name, password)
       VALUES ($1, $2)`,
      [username.trim(), passwordHash]
    );

  return res.status(201).json({ message: 'User registered' });
  } catch (err) {
    // Unique violation (username already taken)
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Username already taken' });
    }
    console.error('Register error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }

})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});