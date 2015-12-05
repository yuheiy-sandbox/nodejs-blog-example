'use strict';
import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import csrf from 'csurf';
import compression from 'compression';
import mongoose, { Schema } from 'mongoose';
import connectMongo from 'connect-mongo';
import routes from './routes/index';
import admin from './routes/admin';

const app = express();
const MongoStore = connectMongo(session);

const PostSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  date: {
    type: String,
    default: Date.now
  }
});
mongoose.model('Post', PostSchema);

mongoose.connect(process.env.MONGOLAB_URI);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(cookieParser());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}));
app.use(csrf());
app.use(compression());
app.use(express.static(path.join(__dirname, '..', 'public'), {
  maxAge: 1000 * 3600 * 24 * 31
}));

app.use('/', routes);
app.use('/admin', admin);

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.render('error', { message: err.message });
});

app.listen(process.env.PORT || 5000);
