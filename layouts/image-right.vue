<!--
  image-right — image on the right (~1/3) with a slanted border, content on the left

  Props:
    image         string   Image URL
    imagePosition string   CSS object-position for the image crop (default: '50% 50%')
    imageWidth    number   % of slide width for the image column (default: 33)
    slant         number   Diagonal slant in slide-% units (default: 5)
    accentColor   string   Divider line color (default: --slidev-theme-primary)
-->
<script setup lang="ts">
const props = defineProps({
  image:         { default: '' as string },
  imagePosition: { default: '50% 50%' as string },
  imageWidth:    { default: 33 as number },
  slant:         { default: 5 as number },
  accentColor:   { default: 'var(--slidev-theme-primary, #89b4fa)' as string },
})

const s = props.slant / 2
// Same /-slant as image-left: top edge of divider is further right, bottom edge further left
const topX = 100 - props.imageWidth + s
const botX = 100 - props.imageWidth - s
const imgClip = `polygon(${topX}% 0, 100% 0, 100% 100%, ${botX}% 100%)`
</script>

<template>
  <div class="slidev-layout image-right-wrap">
    <!-- Image panel, clipped with a slanted left edge -->
    <div class="img-panel" :style="{ clipPath: imgClip }">
      <img
        v-if="image"
        :src="image"
        class="panel-img"
        :style="{
          left: `${100 - imageWidth - slant}%`,
          width: `${imageWidth + slant}%`,
          objectPosition: imagePosition,
        }"
      />
      <div class="vignette" />
    </div>

    <!--
      SVG divider — same technique as panels-highlight:
      viewBox 0–100 maps to slide %, vector-effect keeps stroke in screen px.
    -->
    <svg class="divider" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <line
        :transform="`translate(${100 - imageWidth}, 0)`"
        :x1="s" y1="0"
        :x2="-s" y2="100"
        :stroke="accentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        vector-effect="non-scaling-stroke"
      />
    </svg>

    <!-- Content area ends at topX so it never overlaps the image even at the widest point -->
    <div class="content-area" :style="{ right: `${imageWidth - s}%` }">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.image-right-wrap {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.img-panel {
  position: absolute;
  inset: 0;
}

.panel-img {
  position: absolute;
  top: 0;
  height: 100%;
  object-fit: cover;
  display: block;
}

.vignette {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(to left,   rgba(0,0,0,0.35) 0%, transparent 12%),
    linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, transparent 20%),
    linear-gradient(to top,    rgba(0,0,0,0.15) 0%, transparent 20%);
  pointer-events: none;
}

.divider {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 20;
  overflow: visible;
}

.content-area {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  padding: 2rem 2.5rem;
  z-index: 10;
}
</style>
