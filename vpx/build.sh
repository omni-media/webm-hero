#!/bin/bash

set -e

export OPTIMIZE="-Os"
export AR=emar
export RANLIB=emranlib
export CFLAGS="${OPTIMIZE} -msimd128 -flto -O3 -ftree-vectorize -fvectorize -fslp-vectorize"
export CXXFLAGS="${OPTIMIZE} -msimd128 -O3 -ftree-vectorize -fvectorize -fslp-vectorize"
export LDFLAGS="${OPTIMIZE} -msimd128"

mkdir -p /repo/x/vpx

emcc \
	${OPTIMIZE} \
	-msimd128 \
	-s STRICT=1 \
	-s ALLOW_MEMORY_GROWTH=1 \
	-s ASSERTIONS=0 \
	-s MALLOC=emmalloc \
	-s MODULARIZE=1 \
	-s EXPORT_ES6=1 \
	-s EXPORTED_FUNCTIONS='["_decoder_create","_decoder_decode","_decoder_get_frame","_decoder_destroy","_malloc","_free"]' \
	-I /libvpx \
	/repo/s/decoder/vpx-decoder.c \
	/libvpx/libvpx.a \
	-o /repo/x/vpx/vpx.js

