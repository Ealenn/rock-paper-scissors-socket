import Vue from 'vue'
import App from './vue/App.vue'
import Vuetify from 'vuetify'
import VueSocketio from 'vue-socket.io'
import 'vuetify/dist/vuetify.css'

/* Translate */
import VueI18n from 'vue-i18n'
import Translate from './lang/index.js'
Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: 'en',
  messages: Translate
})

/* Vue */
Vue.use(Vuetify)
Vue.use(VueSocketio, (location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '')))

new Vue({
  i18n,
  el: '#app',
  render: h => h(App)
})
