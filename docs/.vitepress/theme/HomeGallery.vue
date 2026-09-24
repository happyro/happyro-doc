<script setup>
import { ref } from 'vue'

const desktopScreenshots = [
  { file: 'happyro-game-southgate.png', alt: '普隆德拉南门的游戏画面', caption: '普隆德拉南门，熟悉的冒险。' },
  { file: 'happyro-game-map.png', alt: '游戏内地图图鉴', caption: '地图图鉴，支持自动寻路和传送。' },
  { file: 'happyro-game-monsters.png', alt: '游戏内魔物图鉴', caption: '查看魔物的属性、掉落物品和出现地图。' },
  { file: 'happyro-game-npc.png', alt: '游戏内 NPC 图鉴', caption: 'NPC 图鉴，查看位置和形象。' },
  { file: 'happyro-game-items.png', alt: '游戏内物品图鉴', caption: '查询物品图片、属性与说明。' },
  { file: 'happyro-game-char.png', alt: '游戏内角色维护界面', caption: '在游戏里查看并修改角色属性。' },
  { file: 'happyro-game-settings.png', alt: '游戏内服务器设置', caption: '调整经验、掉落和相关设置。' },
]

const mobileScreenshots = [
  { file: 'happyro-mobile-southgate.jpg', alt: '手机平板游戏主界面', caption: '触屏移动、六格快捷栏与自动战斗。', width: 2309, height: 1170 },
  { file: 'happyro-mobile-auto-fight.jpg', alt: '手机平板自动战斗设置', caption: '多选魔物、配置攻击技能与战斗范围。', width: 2292, height: 1170 },
]

const desktop = desktopScreenshots.map(shot => ({ ...shot, image: `/images/game/desktop/${shot.file}`, platform: '电脑桌面', link: '/game/desktop', width: 2048, height: 1668 }))
const mobile = mobileScreenshots.map(shot => ({ ...shot, image: `/images/game/mobile/${shot.file}`, platform: '手机平板', link: '/game/mobile' }))
const screenshots = [...desktop, ...mobile]

const viewport = ref(null)
const active = ref(0)

function goTo(index) {
  const next = Math.max(0, Math.min(index, screenshots.length - 1))
  viewport.value?.scrollTo({ left: next * viewport.value.clientWidth, behavior: 'smooth' })
  active.value = next
}

function onScroll() {
  if (viewport.value?.clientWidth) {
    active.value = Math.max(0, Math.min(screenshots.length - 1, Math.round(viewport.value.scrollLeft / viewport.value.clientWidth)))
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
    <div
      ref="viewport"
      class="home-gallery-viewport"
      :style="{ aspectRatio: `${screenshots[active].width} / ${screenshots[active].height}` }"
      @scroll.passive="onScroll"
    >
      <figure v-for="(shot, index) in screenshots" :key="shot.file" class="home-gallery-slide">
        <a :href="shot.link" :aria-label="`${shot.alt}，查看${shot.platform}文档`">
          <img
            :src="shot.image"
            :alt="shot.alt"
            :loading="index === 0 ? 'eager' : 'lazy'"
            :width="shot.width"
            :height="shot.height"
          />
        </a>
      </figure>
    </div>
  </section>
</template>
