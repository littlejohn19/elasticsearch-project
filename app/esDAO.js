
import * as _ from 'lodash';
import config from './config';
import elasticsearch from 'elasticsearch';
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


export {
  save
};
