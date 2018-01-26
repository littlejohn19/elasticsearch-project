'use strict';

import config from './config';
import esDAO from './esDAO';
import request from 'http-as-promised';
import Promise from 'bluebird';

const xpath = require('xpath');
const dom = require('xmldom').DOMParser;
const homePage = config.homePage;


function runIndex() {
  return Promise.resolve().then(() => {
    return crawlCategory(config.crawlObject);
  });
}

function getOne(id) {
  return esDAO.get(id).then(result => {
    return result;
  })
}

function getAll() {
  return esDAO.scroll().then(result => {
    return result;
  })
}

function getPhrase(phrase) {
  return esDAO.phraseScroll(phrase).then(result => {
    return result;
  })
}


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
      };
      crawlCategory(crawlObject)
    })
  })
}

function crawlCategoryAndPage(crawlObject) {
  let categoryRequestConfig = {
    url: crawlObject.url
  };
  request.get(categoryRequestConfig).spread((response, data) => {

    let domObject = new dom().parseFromString(data);
    let subcategories = xpath.select('//div[@id="mw-subcategories"]//div[@class="mw-category-group"]//a', domObject);
    subcategories.forEach(subcategory => {

      let crawlObject = {
        name: xpath.select('text()', subcategory),
        url: homePage + xpath.select('string(@href)', subcategory)
      };
      // console.log("CATEGORY: " + crawlObject.name + " \t " + crawlObject.url);
      crawlCategory(crawlObject)
    });

    let pages = xpath.select('//div[@id="mw-pages"]//div[@class="mw-category-group"]//a', domObject);
    pages.forEach(page => {
      let crawlObject = {
        name: xpath.select('text()', page),
        url: homePage + xpath.select('string(@href)', page)
      };
      // console.log("PAGE: " + crawlObject.name + " \t " + crawlObject.url)
    })
  });
}

let id = 0;

function crawlCategory(crawlObject) {
  let categoryRequestConfig = {
    url: crawlObject.url
  };
  request.get(categoryRequestConfig).spread((response, data) => {

    let domObject = new dom().parseFromString(data);
    let subcategories = xpath.select('//div[@id="mw-subcategories"]//div[@class="mw-category-group"]//a', domObject);
    subcategories.forEach(subcategory => {

      let crawlObject = {
        name: xpath.select('text()', subcategory),
        url: homePage + xpath.select('string(@href)', subcategory)
      };

      // console.log("CATEGORY: " + crawlObject.name + " \t " + crawlObject.url);

      let body = {
        category: crawlObject.name[0].data,
        url: crawlObject.url
      };

      return esDAO.save(id++, body).then(() => {
        return crawlCategory(crawlObject);
      });
    });
  });
}

export default {
  runIndex: runIndex,
  getOne: getOne,
  getAll: getAll,
  getPhrase: getPhrase
};
