
FROM emscripten/emsdk:3.1.6

WORKDIR /libvpx
RUN git clone --quiet --branch v1.15.1 --depth 1 https://chromium.googlesource.com/webm/libvpx . && rm -rf ./.git

RUN emconfigure ./configure \
		--target=generic-gnu \
		--disable-examples \
		--disable-tools \
		--disable-docs \
		--disable-unit-tests && \
	emmake make -j$(nproc) --keep-going && \
	emranlib libvpx.a

