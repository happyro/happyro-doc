<script setup>
import { ref } from 'vue'

const screenshots = [
  { file: 'happyro-game-southgate.png', alt: '普隆德拉南门的游戏画面', caption: '从浏览器进入普隆德拉南门，继续熟悉的冒险。' },
  { file: 'happyro-game-login.png', alt: 'HappyRO 游戏登录界面', caption: '打开网页，即可登录游戏。' },
  { file: 'happyro-game-map.png', alt: '游戏内地图图鉴', caption: '查看地图和 NPC 位置，并规划前往目的地的路线。' },
  { file: 'happyro-game-monsters.png', alt: '游戏内魔物图鉴', caption: '查找魔物的属性、掉落物品和出现地图。' },
  { file: 'happyro-game-npc.png', alt: '游戏内 NPC 图鉴', caption: '按地图寻找 NPC，查看位置和形象。' },
  { file: 'happyro-game-items.png', alt: '游戏内物品图鉴', caption: '查询物品图片、属性与中文说明。' },
  { file: 'happyro-game-char.png', alt: '游戏内角色维护界面', caption: '在游戏里查看并维护角色属性。' },
  { file: 'happyro-game-settings.png', alt: '游戏内服务器设置', caption: '在游戏中调整经验、掉落和地图设置。' },
]

const viewport = ref(null)
const active = ref(0)

function goTo(index) {
  const next = Math.max(0, Math.min(index, screenshots.length - 1))
  viewport.value?.scrollTo({ left: next * viewport.value.clientWidth, behavior: 'smooth' })
  active.value = next
}

function onScroll() {
  if (viewport.value?.clientWidth) {
    active.value = Math.round(viewport.value.scrollLeft / viewport.value.clientWidth)
  }
}
</script>

<template>
  <section class="home-gallery" aria-label="游戏画面">
    <p class="home-gallery-caption">{{ screenshots[active].caption }}</p>
    <div class="home-gallery-controls">
      <div class="home-gallery-pages" aria-label="选择图片">
        <button
          v-for="(shot, index) in screenshots"
          :key="shot.file"
          type="button"
          :aria-label="`第 ${index + 1} 张：${shot.alt}`"
          :aria-current="active === index ? 'true' : undefined"
          :title="shot.alt"
          @click="goTo(index)"
        />
      </div>
    </div>
    <div ref="viewport" class="home-gallery-viewport" @scroll.passive="onScroll">
      <figure v-for="(shot, index) in screenshots" :key="shot.file" class="home-gallery-slide">
        <img
          :src="`/images/features/${shot.file}`"
          :alt="shot.alt"
          :loading="index === 0 ? 'eager' : 'lazy'"
          width="1024"
          height="830"
        />
      </figure>
    </div>
  </section>
</template>
