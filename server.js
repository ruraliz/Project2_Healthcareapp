require('dotenv').config();
const express = require('express');
const layouts = require('express-ejs-layouts');
const app = express();
const session = require('express-session');
const flash = require('connect-flash')
const SECRET_SESSION = process.env.SECRET_SESSION;
const methodOverride = require('method-override')
const passport = require('./config/ppConfig');

const isLoggedIn = require('./middleware/isLoggedIn');
const db = require('./models');

app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
app.use(require('morgan')('dev'));

app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public')); 
app.use(layouts);

app.use(session({
  secret: SECRET_SESSION,  
  resave: false,
  saveUninitialized: true 
}));  
app.use(flash());   
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next)=> {
console.log('res locals >>>', res.locals);
res.locals.alerts = req.flash();
res.locals.currentUser = req.user;
next();
})
app.get('/', (req, res) => {
  res.render('index');
})



app.use('/auth', require('./controllers/auth'));

app.get('/about', (req, res) => {
  res.render('about')
})


app.get('/profile', isLoggedIn, (req, res) => {
  const { id, name, email } = req.user.get(); 
  res.render('profile', { id, name, email });
});

app.get('/profile/edit', isLoggedIn, async (req, res) => {
  res.render('edit')
})
app.put('/profile/:id', isLoggedIn, async (req, res) => {
  try {
      const foundUser = await db.user.findOne({ where: { email: req.body.email }});
      if (foundUser.email && foundUser.id !== req.user.id) {
        req.flash('error', 'Email already exists. Please try again.');
        res.redirect('/profile');
      } else {
        const usersUpdated = await db.user.update({
          email: req.body.email,
          name: req.body.name
        }, {
          where: {
            id: req.params.id
          }
        });

        res.redirect('/profile'); 
      }
  } catch (error) {
    res.render('edit');
  }
});

app.use('/recipes', isLoggedIn, require('./controllers/recipes'))

app.get('*', (req, res) => {
  res.render('404');
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🎧 You're listening to the smooth sounds of port ${PORT} 🎧`);
});

