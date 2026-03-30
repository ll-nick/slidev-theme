<!--
  panels-highlight — diagonal multi-panel layout with click-to-expand

  Props:
    images        string[]   Image URLs, one per panel. Count inferred from length.
    offsets       string[]   CSS object-position per panel (e.g. '50% 0%'). Fine-tunes crop.
    highlighted   number     1-based index of the panel to expand on click. Omit for static equal split.
    expandedWidth number     % of slide width given to the highlighted panel (default: 60).
    slant         number     Diagonal slant in slide-% units (default: 5).
    accentColor   string     Divider line color (default: --slidev-theme-primary).
-->
<script setup lang="ts">
const props = defineProps({
  images:        { default: () => [] as string[] },
  offsets:       { default: () => [] as string[] },
  highlighted:   { default: null as number | null },
  expandedWidth: { default: 60 },
  slant:         { default: 5 },
  accentColor:   { default: 'var(--slidev-theme-primary, #89b4fa)' },
})

const count = props.images.length || 3

// Returns N-1 dividers as [top_x%, bottom_x%] pairs.
// In equal state each panel gets 100/N %; in highlighted state the active
// panel gets expandedWidth % and the rest share what remains.
function getDividers(h: number | null): number[][] {
  const s = props.slant / 2
  if (!h) {
    return Array.from({ length: count - 1 }, (_, i) => {
      const x = ((i + 1) / count) * 100
      return [x + s, x - s]
    })
  }
  const otherW = (100 - props.expandedWidth) / (count - 1)
  let x = 0
  return Array.from({ length: count - 1 }, (_, i) => {
    x += i === h - 1 ? props.expandedWidth : otherW
    return [x + s, x - s]
  })
}

function clipPath(idx: number, divs: number[][]): string {
  const n = divs.length + 1
  if (idx === 0)     return `polygon(0 0, ${divs[0][0]}% 0, ${divs[0][1]}% 100%, 0 100%)`
  if (idx === n - 1) return `polygon(${divs[n-2][0]}% 0, 100% 0, 100% 100%, ${divs[n-2][1]}% 100%)`
  return `polygon(${divs[idx-1][0]}% 0, ${divs[idx][0]}% 0, ${divs[idx][1]}% 100%, ${divs[idx-1][1]}% 100%)`
}

// Image is sized to cover only its visible strip (not the full slide) so that
// object-fit:cover zooms as little as possible.  A buffer beyond each divider
// midpoint ensures the diagonal region stays covered.
function imageBounds(idx: number, divs: number[][]): { left: number; width: number } {
  const n   = divs.length + 1
  const buf = props.slant
  const mid = (d: number[]) => (d[0] + d[1]) / 2
  if (idx === 0) {
    return { left: 0, width: Math.min(100, mid(divs[0]) + buf) }
  }
  if (idx === n - 1) {
    const l = Math.max(0, mid(divs[n - 2]) - buf)
    return { left: l, width: 100 - l }
  }
  const l = Math.max(0, mid(divs[idx - 1]) - buf)
  const r = Math.min(100, mid(divs[idx]) + buf)
  return { left: l, width: r - l }
}

function panelOpacity(idx: number, clicks: number): number {
  if (!props.highlighted || clicks === 0) return 1
  return Number(props.highlighted) === idx + 1 ? 1 : 0.2
}
</script>

<template>
  <div class="panels-wrap">
    <!-- Registers one click step when a highlighted panel is configured -->
    <span v-if="highlighted" v-click style="display: none" />

    <!--
      v-for over a single-item array is a Vue pattern for introducing a
      template-level variable (divs) so getDividers is called only once.
    -->
    <template v-for="divs in [getDividers($clicks > 0 ? Number(highlighted) : null)]" :key="0">
      <div
        v-for="idx in count"
        :key="idx"
        class="panel"
        :class="`bg-${(idx - 1) % 3}`"
        :style="{
          clipPath: clipPath(idx - 1, divs),
          opacity:  panelOpacity(idx - 1, $clicks),
        }"
      >
        <img
          v-if="images[idx - 1]"
          :src="images[idx - 1]"
          class="panel-img"
          :style="{
            left:           `${imageBounds(idx - 1, divs).left}%`,
            width:          `${imageBounds(idx - 1, divs).width}%`,
            objectPosition: offsets[idx - 1] ?? '50% 0%',
          }"
        />
        <div class="vignette" />
      </div>

      <!--
        viewBox="0 0 100 100" + preserveAspectRatio="none" maps user units
        directly to slide %, so translate(x, 0) animates the line position.
        The slant is baked into x1/x2; only the translate changes on click,
        and CSS can transition SVG transform — fixing the snap.
        vector-effect="non-scaling-stroke" keeps the stroke width in screen px.
      -->
      <svg class="dividers" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <line
          v-for="([xt, xb], i) in divs"
          :key="i"
          :transform="`translate(${(xt + xb) / 2}, 0)`"
          :x1="slant / 2" y1="0"
          :x2="-slant / 2" y2="100"
          :stroke="accentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          vector-effect="non-scaling-stroke"
        />
      </svg>
    </template>
  </div>
</template>

<style scoped>
.panels-wrap {
  position: absolute;
  inset: 0;
  overflow: hidden;
  background: #0a0a14;
}

.panel {
  position: absolute;
  inset: 0;
  transition: clip-path 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s ease;
}

/* Subtle per-panel background tint */
.bg-0 { background: #0f0f1b; }
.bg-1 { background: #161625; }
.bg-2 { background: #1e1e2e; }

.panel-img {
  position: absolute;
  top: 0;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: left 0.6s cubic-bezier(0.4, 0, 0.2, 1), width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Edge vignette for depth and diagonal line legibility */
.vignette {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(to right,  rgba(0,0,0,0.4) 0%, transparent 10%),
    linear-gradient(to left,   rgba(0,0,0,0.4) 0%, transparent 10%),
    linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, transparent 20%),
    linear-gradient(to top,    rgba(0,0,0,0.2) 0%, transparent 20%);
  pointer-events: none;
}

.dividers {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 20;
  overflow: visible;
}

.dividers line {
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
