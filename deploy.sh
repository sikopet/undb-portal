#!/bin/sh

docker build -t localhost:5000/undb-portal git@github.com:scbd/undb-portal

docker push localhost:5000/undb-portal
