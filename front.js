import Vue from 'vue'
import App from './vue/App.vue'
import Vuetify from 'vuetify'
import VueSocketio from 'vue-socket.io'
import 'vuetify/dist/vuetify.css'

/* Vue */
Vue.use(Vuetify)
Vue.use(VueSocketio, (location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '')))

new Vue({
  el: '#app',
  render: h => h(App)
})
