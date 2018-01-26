'use strict';

import manager from './es.manager'


const indexEndpoint = (router) => {
  router.route('/api/index').get((request, response) => {
    manager.runIndex().then((result) => {
      response.status(200).send(result);
    }).catch((error) => {
      response.status(404).send(error);
    });
  });
  router.route('/api/index/find/:id').get((request, response) => {
    manager.getOne(request.params.id).then((result) => {
      response.status(200).send(result);
    }).catch((error) => {
      response.status(404).send(error);
    });
  });
  router.route('/api/index/find').get((request, response) => {
    manager.getAll().then((result) => {
      response.status(200).send(result);
    }).catch((error) => {
      response.status(404).send(error);
    });
  });
};


const routes = function (router) {
  indexEndpoint(router);
};


export default routes;
