import * as _ from 'lodash';
import config from './config';
import elasticsearch from 'elasticsearch';
import request from 'http-as-promised';

const xpath = require('xpath');
const dom = require('xmldom').DOMParser;

const parseString = require('xml2js').parseString;
const es = new elasticsearch.Client(_.cloneDeep(config.es.options));

function save(key, value) {
  const params = {
    index: config.es.index,
    type: 'config',
    id: key,
    body: {
      value
    },
    refresh: true
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

function scroll() {
  let allRecords = [];

  return Promise.resolve().then(() => {
    return es.search({
      index: config.es.index,
      type: 'config',
      scroll: '10s',
      body: {
        query: {
          "match_all": {}
        }
      }
    }, function getMoreUntilDone(error, response) {
      response.hits.hits.forEach(function (hit) {
        allRecords.push(hit);
      });

      if (response.hits.total !== allRecords.length) {
        return es.scroll({
          scrollId: response._scroll_id,
          scroll: '10s'
        }, getMoreUntilDone);

      } else {

        console.log('all done', allRecords);
      }
    });
  });
}


export default {
  get: get,
  save: save,
  scroll: scroll
};
