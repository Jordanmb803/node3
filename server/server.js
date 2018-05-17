const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const expressSession = require('express-session');
const port = 3457;

const data = require('./data');

function pizzaLover(req,res, next){
    if(req.session.favorite === 'pizza'){
      next()
    } else {
      res.status(403).send('You don\'t love the right food...')
    }
}

// Create Url loggin middleware that will console the url if not in production
app.use((req, res, next) => {
  console.log(req.url);
  next(); 
})

app.use(bodyParser.json());

// Setup sessions to be used
// secret - Super Secret Password to be used to verify the cookie
// resave - Resave the session even if nothing changes false for most sessions
// saveUninitialized - Save a cookie even if no other info has been saved
// cookie : 
//   secure - Require https?  Set to false for development, consider swapping to true for production
//   maxAge - Time that the cookie is valid for in ms
app.use(expressSession({
  secret:'ljdhf9238r3982prfjl23jr02j3kjfs0;das00234954dkfjd;kjffjiqdjhfldjahfljsd9habcdfh283643hgd',
  resave:false,
  saveUninitialized:true,
  cookie:{
    secure:false,
    maxAge:1000*60*5
  }
}))

// GET /api/set
// Saves a favorite that has come in as a query parameter to the session
app.get('/api/set', (req, res) => {
   req.session.favorite = req.query.favorite
   res.send('Favorite Saved as ' + req.query.favorite);
})

// GET /api/get
// Returns the session object to the frontend
app.get('/api/get', (req, res) => {
  res.send(req.session);
})

// Get /api/users
// Change from always returning all the data, to filtering based on an incoming query.
// Then change so that it only returns if the user is set to love pizza
// Cause you can't trust those hamburger eaters.

app.get('/api/users', pizzaLover, (req, res) => {
  let filtered = data;
  if (req.query.eye){
      filtered = filtered.filter( user=> user.eyeColor === req.query.eye);
  }
  if (req.query.hair){
      filtered = filtered.filter( user=> user.hairColor === req.query.hair);
  }
  if (req.query.name){
      filtered = filtered.filter( user=> `${user.name.firstName} ${user.name.lastName}`.includes(req.query.name)>-1)
  }
res.send(filtered);
})


app.listen(port, () => console.log(`Listening on port ${port}`));
