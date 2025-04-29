#!/bin/bash

set -e

export OPTIMIZE="-Os"
export AR=emar
export RANLIB=emranlib
export CFLAGS="${OPTIMIZE} -msimd128 -flto -O3 -ftree-vectorize -fvectorize -fslp-vectorize"
export CXXFLAGS="${OPTIMIZE} -msimd128 -O3 -ftree-vectorize -fvectorize -fslp-vectorize"
export LDFLAGS="${OPTIMIZE} -msimd128"

eval $@

echo "============================================="
echo "Compiling libvpx"
echo "============================================="

test -n "$SKIP_LIBVPX" || (
	rm -rf build-vpx || true
	mkdir build-vpx
	cd build-vpx

	emconfigure ../node_modules/libvpx/configure \
		--target=generic-gnu \
		--disable-examples \
		--disable-tools \
		--disable-docs \
		--disable-unit-tests

	emmake make -j$(nproc) --keep-going
	emranlib libvpx.a
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
		-msimd128 \
		-s STRICT=1 \
		-s ALLOW_MEMORY_GROWTH=1 \
		-s ASSERTIONS=0 \
		-s MALLOC=emmalloc \
		-s MODULARIZE=1 \
		-s EXPORT_ES6=1 \
		-s EXPORTED_FUNCTIONS='["_decoder_create","_decoder_decode","_decoder_get_frame","_decoder_destroy","_malloc","_free"]' \
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
