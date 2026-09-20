// index.js
const express = require('express');
const path = require('path');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
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

app.post('/login',async(req,res)=>{
 const {username,password} = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  if (typeof username !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'Invalid input types' });
  }
if (/\s/.test(username)) {
    return res.status(400).json({ error: 'Username must not contain whitespace' });
  }
  if (/\s/.test(password)) {
    return res.status(400).json({ error: 'Password must not contain whitespace' });
  }

  if (username.length < 3 || username.length > 30) {
    return res.status(400).json({ error: 'Username must be 3–30 characters' });
  }
  if (password.length < 4 || password.length > 30) {
    return res.status(400).json({ error: 'Password must be 4–30 characters' });
  }

  try{
    const result = await pool.query(
      'SELECT id, name, password, role FROM users WHERE name = $1',
      [username]
    );

    const userinfo = result.rows[0];

    if (!userinfo) {
      await bcrypt.compare(password, '$2b$10$abcdefghijklmnopqrstuu');
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const match = await bcrypt.compare(password, userinfo.password);
    if (!match) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign(
    { id: userinfo.id, name: userinfo.name, role: userinfo.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1h' } // 設定 Token 有效期（例如：1 小時）
  );

   res.redirect('/library_system');
    
  }catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }

})


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
if (/\s/.test(username)) {
    return res.status(400).json({ error: 'Username must not contain whitespace' });
  }
  if (/\s/.test(password)) {
    return res.status(400).json({ error: 'Password must not contain whitespace' });
  }

  if (username.length < 3 || username.length > 30) {
    return res.status(400).json({ error: 'Username must be 3–30 characters' });
  }
  if (password.length < 4 || password.length > 30) {
    return res.status(400).json({ error: 'Password must be 4–30 characters' });
  }

  try {
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const result = await pool.query(
      `INSERT INTO users (name, password)
       VALUES ($1, $2)`,
      [username, passwordHash]
    );

  return res.status(201).json({ message: 'User registered' });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Username already taken' });
    }
    console.error('Register error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }

})

app.get('/library_system',(req,res)=>{
  res.render('library_system');
})

app.post('/library_system',(req,res)=>{

})
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});