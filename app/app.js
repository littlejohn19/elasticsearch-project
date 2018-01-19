'use strict';

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import config from './config';
import { runIndex } from './esDAO';

const app = express();
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.listen(config.port);

app.route('/index')
  .get(function (req, res) {
    res.send(runIndex())
  });

module.exports = app;
