<script setup>
import { ref } from 'vue'
import { withBase } from 'vitepress'

const screenshots = [
  { file: 'happyro-three-devices.png', alt: '电脑、平板和手机三端游戏画面', caption: '同一场冒险，在电脑、平板和手机上继续。', platform: '界面操作', link: '/game/controls', width: 1600, height: 1000 },
  { file: 'happyro-responsive-skills.png', alt: '平板与手机技能界面', caption: '平板与手机的技能界面。', platform: '界面操作', link: '/game/controls', width: 1600, height: 858 },
  { file: 'happyro-codex.png', alt: '游戏内魔物图鉴', caption: '查看魔物的属性、掉落物品和出现地图。', platform: '冒险工具', link: '/game/adventure-tools', width: 880, height: 680 },
  { file: 'happyro-combat.png', alt: '自动战斗设置', caption: '多选魔物、配置攻击技能与战斗范围。', platform: '战斗设置', link: '/game/combat', width: 920, height: 670 },
  { file: 'happyro-admin-settings.png', alt: '管理后台游戏设置', caption: '调整经验、掉落和相关设置。', platform: '管理后台', link: '/admin/game-settings', width: 1280, height: 630 },
].map(shot => ({ ...shot, image: `/images/overview/${shot.file}` }))

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
        <a :href="withBase(shot.link)" :aria-label="`${shot.alt}，查看${shot.platform}文档`">
          <img
            :src="withBase(shot.image)"
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
