#!/bin/bash

docker build -t webm-hero-vpx ./vpx

docker run --rm \
	-u $(id -u):$(id -g) \
	-v $(pwd):/src \
	webm-hero-vpx ./vpx/build.sh

