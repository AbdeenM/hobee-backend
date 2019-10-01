import bodyParser from 'body-parser';
import morgan from 'morgan';
import passport from 'passport';

export default app => {
  app.use(bodyParser.json({ limit: '4mb' }));
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(morgan('dev'));
  app.use(passport.initialize());
};
