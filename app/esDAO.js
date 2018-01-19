import * as _ from 'lodash';
import config from './config';
import elasticsearch from 'elasticsearch';
import request from 'http-as-promised';

const parseString = require('xml2js').parseString;
const es = new elasticsearch.Client(_.cloneDeep(config.es.options));

function save(key, value) {
  const params = {
    index: config.es.index,
    type: 'config',
    id: key,
    body: {
      value
    }
  };
  return es.index(params);
}

function get(key) {
  const params = {
    index: config.es.index,
    type: 'config',
    id: key
  };
  return es.get(params).then(result => {
    return result._source.value;
  }).catch(error => {
    if (404 === error.status) {
      throw 404;
    } else {
      throw error;
    }
  });
}

function runIndex() {

  let requestConfig = {
    url: 'https://en.wikipedia.org/w/api.php?format=xml&action=query&prop=categories&titles=Google'
  };

  return request.get(requestConfig).spread((response, data) => {
    parseString(data, function (err, result) {
      let resp = JSON.stringify(result);
      let obj = JSON.parse(resp);
      let categories = obj.api.query[0].pages[0].page[0].categories[0].cl;

      console.log(categories);
      // _.forEach(categories, (value, key) => {
      //   let category = value['$'].title;
      //   save(key, category);
      // });

      return get(4).then(results => {
        console.log(results);
      });
    });
  })
}


export {
  runIndex
};
