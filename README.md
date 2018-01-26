# Elasticsearch project

## Before your start use

Make sure you have installed on your machine `npm` and `nodemon`

## Installation

	npm install
	
or use (recommened):

	yarn install

## Start locally Elasticsearch using Docker

Make sure you have installed on your machine (Recommended) `docker` - [more here](https://www.docker.com/get-docker) and run:

    docker-compose up
    
Or use local Elasticsearch without Docker - [more here](https://www.elastic.co/downloads/elasticsearch)

After that you can start server using:

    nodemon app

# Sample events

Below are some examples of events received from the controller


## /api/index | GET

Indexing data

## /api/index/find | GET

Get all values

## /api/index/find/:id | GET

Get one value

## /api/index/phrase | POST

Get values by phrase

example payload: {
                 	"phrase": "Bóstwa"
                 }

