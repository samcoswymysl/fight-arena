import * as express from 'express';
import 'express-async-errors';
import * as methodOverride from 'method-override';
import { static as expressStatic, urlencoded } from 'express';
import { engine } from 'express-handlebars';
import './utils/db';

import { homeRouter } from './routers/home';
import { warriorRouter } from './routers/warrior';
import { arenaRouter } from './routers/arena';
import { hallOfGloryRouter } from './routers/hall-of-glory';
import { WarriorRecord } from './records/warrior.record';
import { handleError } from './utils/errors';

const app = express();
app.use(methodOverride('_method'));
app.use(urlencoded({
  extended: true,
}));

app.use(expressStatic('public'));

app.engine(
  '.hbs',
  engine({
    extname: '.hbs',
    // helpers: ??
  }),
);
app.set('views-engine', '.hbs');

app.use('/', homeRouter);
app.use('/warrior', warriorRouter);
app.use('/arena', arenaRouter);
app.use('/hall-of-glory', hallOfGloryRouter);

app.use(handleError);

app.listen(3000, 'localhost', () => {
  console.log('http://localhost:3000');
});
