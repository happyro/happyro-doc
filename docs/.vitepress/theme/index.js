import DefaultTheme from 'vitepress/theme'
import HomeGallery from './HomeGallery.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('HomeGallery', HomeGallery)
  },
}
