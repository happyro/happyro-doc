import DefaultTheme from 'vitepress/theme'
import HomeGallery from './HomeGallery.vue'
import JobProgression from './JobProgression.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('HomeGallery', HomeGallery)
    app.component('JobProgression', JobProgression)
  },
}
