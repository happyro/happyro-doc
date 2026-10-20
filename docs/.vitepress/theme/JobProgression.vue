<script setup>
import { computed } from 'vue'

const props = defineProps({ jobs: { type: Array, required: true } })
const headings = ['一转', '二转', '转生与进阶二转', '三转', '四转']
const steps = computed(() => props.jobs.map((name, index) => ({
  name,
  href: `#${headings[index]}-${name}`,
})))
</script>

<template>
  <nav class="job-progression" aria-label="职业进阶路线">
    <ol class="route-steps" role="list">
      <li v-for="(step, index) in steps" :key="step.name" class="route-step">
        <span v-if="index" class="route-arrow" aria-hidden="true">→</span>
        <a :href="step.href" class="route-job" :class="{ 'route-final': index === 4 }">{{ step.name }}</a>
      </li>
    </ol>
  </nav>
</template>

<style scoped>
.job-progression { margin: 18px 0 24px; }

.job-progression .route-steps {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.job-progression .route-step {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
}

.route-arrow { color: var(--vp-c-text-3); font-size: 13px; }

.job-progression .route-job {
  padding: 4px 10px;
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-size: 14px;
  font-weight: 500;
  line-height: 1.7;
  text-decoration: none;
}

.job-progression .route-final {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-weight: 600;
}

.job-progression .route-job:hover { color: var(--vp-c-brand-1); }
.job-progression .route-job:focus-visible { outline: 2px solid var(--vp-c-brand-1); outline-offset: 3px; }
</style>
