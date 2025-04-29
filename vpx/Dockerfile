
FROM emscripten/emsdk:3.1.6
WORKDIR /deps
RUN git clone --branch v1.15.1 --depth 1 https://chromium.googlesource.com/webm/libvpx && rm -rf libvpx/.git
WORKDIR /src

