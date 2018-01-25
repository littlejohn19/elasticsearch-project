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

// app.route('/index')
//   .get(function (req, res) {
//     res.send(runIndex())
//   });

// TODO: DELETE THIS IMPORTS
import request from 'http-as-promised';
const xpath = require('xpath');
const dom = require('xmldom').DOMParser;

let homePage = 'https://pl.wikipedia.org'

app.route('/')
  .get(function (req, res) {

    // crawlWholeWikipedia();

    let crawlObject = {
      name: 'Religioznawstwo',
      url: 'https://pl.wikipedia.org/wiki/Kategoria:Religioznawstwo'
    }
    console.log("CATEGORY: " + crawlObject.name + " \t " + crawlObject.url)
    crawlCategory(crawlObject)

    res.send("hello")
  }
);

function crawlWholeWikipedia() {
  let requestConfig = {
    url: homePage + '/wiki/Portal:Kategorie_G%C5%82%C3%B3wne'
  };
  request.get(requestConfig).spread((response, data) => {
    let doc = new dom().parseFromString(data);
    let mainCategories = xpath.select('//td[@width="70%"]//p/a', doc);

    mainCategories.forEach(mainCategory => {
      let crawlObject = {
        name: xpath.select('text()', mainCategory),
        url: homePage + xpath.select('string(@href)', mainCategory)
      }
      crawlCategory(crawlObject)
    })
  })
}

function crawlCategory(crawlObject) {
  let categoryRequestConfig = {
    url: crawlObject.url
  };
  request.get(categoryRequestConfig).spread((response, data) => {

    let domObject = new dom().parseFromString(data);
    let subcategories = xpath.select('//div[@id="mw-subcategories"]//div[@class="mw-category-group"]//a', domObject)
    subcategories.forEach(subcategory => {

      let crawlObject = {
        name: xpath.select('text()', subcategory),
        url: homePage + xpath.select('string(@href)', subcategory)
      }
      console.log("CATEGORY: " + crawlObject.name + " \t " + crawlObject.url)
      crawlCategory(crawlObject)
    })
    
    let pages = xpath.select('//div[@id="mw-pages"]//div[@class="mw-category-group"]//a', domObject)
    pages.forEach(page => {
      let crawlObject = {
        name: xpath.select('text()', page),
        url: homePage + xpath.select('string(@href)', page)
      }
      console.log("PAGE: " + crawlObject.name + " \t " + crawlObject.url)
    })
  });

}

module.exports = app;