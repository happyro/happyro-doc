<script setup>
import { onMounted, onBeforeUnmount, ref, useId, watch } from 'vue'
import { useData } from 'vitepress'

const props = defineProps({ source: { type: String, required: true }, title: { type: String, required: true }, maxWidth: { type: Number, default: 960 } })
const { isDark } = useData()
const id = `diagram-${useId().replace(/[^a-zA-Z0-9_-]/g, '-')}`
const svg = ref('')
const error = ref(false)
const scale = ref(100)
let revision = 0
let stop

async function render() {
  const current = ++revision
  try {
    const { default: mermaid } = await import('mermaid')
    // Per-diagram configuration keeps concurrent light/dark renders independent.
    const source = `---\nconfig:\n  theme: ${isDark.value ? 'dark' : 'default'}\n  flowchart:\n    htmlLabels: false\n---\n${props.source}`
    mermaid.initialize({ startOnLoad: false, securityLevel: 'strict', suppressErrorRendering: true })
    const result = await mermaid.render(`${id}-${current}`, source)
    if (current === revision) { svg.value = result.svg; error.value = false }
  } catch {
    if (current === revision) { svg.value = ''; error.value = true }
  }
}
onMounted(() => { stop = watch([() => props.source, isDark], render, { immediate: true }) })
onBeforeUnmount(() => { revision++; stop?.() })
</script>

<template>
  <figure class="service-diagram">
    <figcaption>{{ title }}</figcaption>
    <div class="diagram-toolbar" role="group" :aria-label="`${title}缩放`">
      <button type="button" :disabled="scale <= 50" @click="scale -= 25">缩小</button>
      <button type="button" @click="scale = 100">重置</button>
      <button type="button" :disabled="scale >= 200" @click="scale += 25">放大</button>
      <span aria-live="polite">{{ scale }}%</span>
    </div>
    <div class="diagram-viewport" tabindex="0" role="region" :aria-label="`${title}，可横向滚动`">
      <div v-if="svg" class="diagram-canvas" :style="{ width: `${scale}%`, minWidth: `${Math.min(560, maxWidth) * scale / 100}px`, maxWidth: `${maxWidth * scale / 100}px` }" role="img" :aria-label="title" v-html="svg" />
      <p v-else role="status">{{ error ? '图表暂时无法显示，请查看下方文字说明或图源。' : '正在加载图表…' }}</p>
    </div>
    <details><summary>查看 Mermaid 图源</summary><pre>{{ source }}</pre></details>
  </figure>
</template>

<style scoped>
.service-diagram { margin: 24px 0; padding: 16px; border: 1px solid var(--vp-c-divider); border-radius: 8px; }
figcaption { font-weight: 600; }
.diagram-toolbar { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin: 12px 0; font-size: 13px; }
button { padding: 3px 10px; border: 1px solid var(--vp-c-divider); border-radius: 5px; background: var(--vp-c-bg-soft); cursor: pointer; }
button:disabled { opacity: .45; cursor: default; }
button:focus-visible, .diagram-viewport:focus-visible { outline: 2px solid var(--vp-c-brand-1); outline-offset: 2px; }
.diagram-viewport { overflow: auto; }
.diagram-canvas { margin: auto; }
.diagram-canvas :deep(svg) { display: block; width: 100%; max-width: none !important; height: auto; }
.diagram-canvas :deep(.nodeLabel p) { margin: 0; line-height: inherit; }
details { margin-top: 12px; font-size: 13px; }
summary { cursor: pointer; }
pre { overflow: auto; white-space: pre; }
</style>
