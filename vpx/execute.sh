#!/bin/bash

docker build -t webm-hero-vpx ./vpx

docker run --rm \
	-u $(id -u):$(id -g) \
	-v $(pwd):/repo \
	webm-hero-vpx /repo/vpx/build.sh

