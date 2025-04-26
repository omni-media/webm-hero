#include <stdlib.h>
#include <stdint.h>
#include "vpx/vpx_decoder.h"
#include "vpx/vp8dx.h"
#include <stdio.h>
// Global decoder context
static vpx_codec_ctx_t decoder;

// Initialize the VP8 decoder
int decoder_create() {
	vpx_codec_iface_t *iface = vpx_codec_vp8_dx();
	vpx_codec_dec_cfg_t cfg = {0};
	vpx_codec_flags_t flags = 0;

	if (vpx_codec_dec_init(&decoder, iface, &cfg, flags)) {
		return 0; // failure
	}
	return 1; // success
}

// Feed compressed data to decoder
int decoder_decode(uint8_t *data, int len) {
	if (vpx_codec_decode(&decoder, data, len, NULL, 0)) {
		const char* error = vpx_codec_error(&decoder);
		const char* detail = vpx_codec_error_detail(&decoder);
		printf("Decode error: %s\nDetail: %s\n", error, detail ? detail : "none");
		return 0; // failure
	}
	return 1; // success
}

// Get the decoded frame (returns pointer to vpx_image_t)
vpx_image_t* decoder_get_frame() {
	vpx_codec_iter_t iter = NULL;
	return vpx_codec_get_frame(&decoder, &iter);
}

// Destroy the decoder
void decoder_destroy() {
	vpx_codec_destroy(&decoder);
}
