#!/bin/bash

set -e

export OPTIMIZE="-Os"
export LDFLAGS="${OPTIMIZE}"
export CFLAGS="${OPTIMIZE}"
export CXXFLAGS="${OPTIMIZE}"

eval $@

echo "============================================="
echo "Compiling libvpx"
echo "============================================="
test -n "$SKIP_LIBVPX" || (
    rm -rf build-vpx || true
    mkdir build-vpx
    cd build-vpx
    emconfigure ../node_modules/libvpx/configure \
      --target=generic-gnu
    emmake make
)
echo "============================================="
echo "Compiling libvpx done"
echo "============================================="

echo "============================================="
echo "Compiling wasm bindings (with wrapper)"
echo "============================================="
(
	emcc \
		${OPTIMIZE} \
		-s STRICT=1 \
		-s ALLOW_MEMORY_GROWTH=1 \
		-s ASSERTIONS=0 \
		-s MALLOC=emmalloc \
		-s MODULARIZE=1 \
		-s EXPORT_ES6=1 \
		-s EXPORTED_FUNCTIONS='["_decoder_create","_decoder_decode","_decoder_get_frame","_decoder_destroy", "_malloc", "_free"]' \
		-I ./node_modules/libvpx \
		./s/decoder/vpx-decoder.c \
		build-vpx/libvpx.a \
		-o my-module.js

	mkdir -p dist
	mv my-module.{js,wasm} dist
)
echo "============================================="
echo "Compiling wasm bindings done"
echo "============================================="
