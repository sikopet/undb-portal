#!/bin/sh

docker build -t localhost:5000/soi-portal git@github.com:scbd/soi-portal

docker push localhost:5000/soi-portal
