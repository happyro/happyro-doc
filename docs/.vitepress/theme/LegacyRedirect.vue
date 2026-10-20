<script setup>
import { computed, onMounted } from 'vue'
import { withBase } from 'vitepress'
import routes from '../redirects.json'
const props = defineProps({ from: { type: String, required: true } })
const target = computed(() => routes[props.from].to)
onMounted(() => {
  const entry = routes[props.from]
  let anchor = window.location.hash.slice(1)
  try { anchor = decodeURIComponent(anchor) } catch { /* Preserve an undecodable legacy hash. */ }
  const mapped = entry.anchors?.[anchor]
  window.location.replace(withBase(mapped || entry.to) + (mapped ? '' : window.location.hash))
})
</script>

<template>
  <main class="legacy-redirect"><h1>文档已迁移</h1><p>正在前往新页面。若未自动跳转，请<a :href="withBase(target)">打开当前文档</a>。</p></main>
</template>
