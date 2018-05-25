<template>
  <v-app>
      <v-content>
          <!-- Notification -->
          <v-snackbar
              :timeout="2000"
              color="info"
              :bottom="true"
              v-model="snackbar"
          >
          {{ haveChoice.pseudo }} {{ i18n.notification.text }}
          </v-snackbar>

          <!-- Pseudo-->
          <v-dialog v-model="dialogPseudo" max-width="500px" persistent>
              <v-card text-xs-center>
                  <v-card-media
                      src="/img/joystick.png"
                      height="200px"
                  >
                  </v-card-media>
                  <v-card-title>
                      <h3>{{ i18n.username.title }}</h3>
                  </v-card-title>

                  <v-card-text style="padding-top:0">
                          

                          <v-container grid-list-md text-xs-center>
                              <v-layout row wrap>
                                  <v-flex xs6>
                                          <v-btn depressed :disabled="lang == 'fr'" @click="lang = 'fr'">
                                              <span class="flag-icon flag-icon-fr mr-2"></span>
                                              Français
                                          </v-btn>
                                  </v-flex>
                                  <v-flex xs6>
                                          <v-btn depressed :disabled="lang == 'en'" @click="lang = 'en'">
                                              <span class="flag-icon flag-icon-gb mr-2"></span>
                                              English
                                          </v-btn>
                                  </v-flex>
                              </v-layout>
                          </v-container>


                          <v-form ref="form" v-model="validPseudo" v-on:submit.prevent="changePseudo()" lazy-validation>
                              <v-text-field
                                  v-model="myPseudo"
                                  :rules="[v => !!v || 'Name is required', v => v.length <= 10 || 'Name must be less than 10 characters']"
                                  counter="10"
                                  :label="i18n.username.field"
                                  required
                              ></v-text-field>
                          
                              <div class="text-xs-center">
                                  <v-btn
                                      depressed
                                      color="primary"
                                      :disabled="!validPseudo"
                                      @click="changePseudo()"
                                  >
                                      {{ i18n.username.submit }}
                                  </v-btn>
                                  <v-btn flat @click="myPseudo = ''">{{ i18n.username.clear }}</v-btn>
                              </div>
                          </v-form>
                  </v-card-text>
              </v-card>
          </v-dialog>

          <!-- Game -->
          <v-container grid-list-md text-xs-center>
              <v-layout row wrap>

                  <!-- GITHUB -->
                  <v-flex xs12 class="text-xs-right" v-if="game.player.length == 1">
                          <a href="https://github.com/Ealenn/rock-paper-scissors-socket" style="text-decoration: none">
                              <v-btn
                                  depressed
                                  color="grey"
                                  class="white--text"
                              >
                                  View on GitHub
                                  <v-icon right dark>fab fa-github</v-icon>
                              </v-btn>
                          </a>
                  </v-flex>

                  <!-- AWAIT -->
                  <v-flex xs12 v-if="game.player.length == 1">
                      <v-card>
                              <v-toolbar color="light-blue" dark flat>
                                  <v-toolbar-title>{{ i18n.await.title }}</v-toolbar-title>
                                  <v-spacer></v-spacer>
                              </v-toolbar>
                              
                              <v-card-text primary-title>
                                  <div style="margin:auto">

                                      <div>
                                          <v-avatar size="128px">
                                              <img src="/img/spinner.gif" />
                                            </v-avatar>
                                          
                                          <h4>{{ i18n.await.title }}</h4>
                                      </div>

                                      <hr>

                                      <div class="text-xs-center">{{ i18n.await.invite }}</div>
                                      <div class="text-xs-center">{{ i18n.await.warning }}</div>
                                      <div class="text-xs-center">
                                              <v-tooltip top>
                                                  <v-btn slot="activator" depressed class="btn-copy-link" :data-clipboard-text="sharedLink">{{ game.session }}</v-btn>
                                                  <span>{{ i18n.await.clipboard.description }}</span>
                                              </v-tooltip>
                                      </div>

                                      <div class="mt-3">
                                          <a :href="'https://www.facebook.com/sharer/sharer.php?u=' + sharedLink" target="_BLANC" style="text-decoration: none">
                                              <v-btn depressed style="background:#3b5999" class="white--text">Facebook</v-btn>
                                          </a>
                                          <a :href="'https://twitter.com/home?status=' + sharedLink" target="_BLANC" style="text-decoration: none">
                                              <v-btn depressed style="background:#55acee" class="white--text">Twitter</v-btn>
                                          </a>
                                          
                                          <v-tooltip top>
                                              <v-btn slot="activator" depressed class="btn-copy-link white--text" :data-clipboard-text="sharedLink"  style="background:#3C3C3C">{{ i18n.await.clipboard.title }}</v-btn>
                                              <span>{{ i18n.await.clipboard.description }}</span>
                                          </v-tooltip>
                                      </div>
                                  </div>
                              </v-card-text>
                              <p>
                              </p>
                      </v-card>
                  </v-flex>

                  <!-- QRCode -->
                  <v-flex xs12 v-if="game.player.length == 1">
                      <qrcode-view :title="i18n.qrcode.title" :description="i18n.qrcode.description" :link="sharedLink"></qrcode-view>
                  </v-flex>

                  <!-- GAME -->
                  <v-flex xs12 v-if="game.player.length == 2">
                      <v-card>
                              <v-toolbar color="light-green" dark flat>
                                  <v-toolbar-title>{{ i18n.game.title }}</v-toolbar-title>
                                  <v-spacer></v-spacer>
                              </v-toolbar>

                              <!-- AWAIT/CONTINUE -->
                              <div class="mt-5 mb-2" v-if="!showAction">
                                      <h3 v-if="!results.win">{{ i18n.game.waiting }}</h3>
                                      <v-layout row wrap>

                                          <v-flex xs6 v-for="player in results.player" v-if="results.win" v-bind:key="player.idPlayer">
                                              <h3>{{ player.pseudo }}<v-chip color="primary" text-color="white" v-if="me.idPlayer == player.idPlayer">{{ i18n.game.me }}</v-chip></h3>
                                              <v-icon style="font-size: 7em">{{ getIcon(player.choice) }}</v-icon>
                                          </v-flex>

                                          <v-flex xs6 v-for="player in game.player" v-if="!results.win" v-bind:key="player.idPlayer">
                                              <h3>{{ player.pseudo }}<v-chip color="primary" text-color="white" v-if="me.idPlayer == player.idPlayer">{{ i18n.game.me }}</v-chip></h3>
                                              <v-icon style="font-size: 7em" v-if="me.idPlayer == player.idPlayer">{{ getIcon(myChoice) }}</v-icon>
                                              <v-icon style="font-size: 7em" v-else>{{ blinkIcon }}</v-icon>
                                          </v-flex>

                                          <v-flex xs12 class="mt-5" v-if="results.win">
                                              <h1>
                                                  <v-icon>fas fa-trophy</v-icon>
                                                  {{ results.win[lang] }}
                                                  <v-icon>fas fa-trophy</v-icon>
                                              </h1>
                                              <h2>{{ results.result[lang] }}</h2>
                                              <v-btn depressed large @click="setContinue()">{{ i18n.game.continue }}</v-btn>
                                          </v-flex>
                                      </v-layout>
                              </div>
                              
                              <!-- ACTION -->
                              <div class="pb-3 pt-3" v-if="showAction">

                                  <h2 class="mb-2">{{ i18n.game.action.title }}</h2>

                                  <v-btn
                                  large
                                  depressed
                                  color="blue"
                                  class="white--text"
                                  @click="setChoice(0)"
                                  >
                                      {{ i18n.game.action.rock }}
                                      <v-icon right dark>far fa-hand-rock</v-icon>
                                  </v-btn>

                                  <v-btn
                                  large
                                  depressed
                                  color="blue"
                                  class="white--text"
                                  @click="setChoice(1)"
                                  >
                                      {{ i18n.game.action.paper }}
                                      <v-icon right dark>far fa-hand-paper</v-icon>
                                  </v-btn>

                                  <v-btn
                                  large
                                  depressed
                                  color="blue"
                                  class="white--text"
                                  @click="setChoice(2)"
                                  >
                                      {{ i18n.game.action.scissors }}
                                      <v-icon right dark>far fa-hand-scissors</v-icon>
                                  </v-btn>
                              </div>
                              
                          </v-card>
                  </v-flex>

                  <!-- BOTTOM -->
                  <v-flex xs12 sm6 v-if="game.player.length == 2">
                          <v-card color="primary">
                                  <v-toolbar color="light-blue" dark flat>
                                      <v-toolbar-title>{{ i18n.stats.score }}</v-toolbar-title>
                                      <v-spacer></v-spacer>
                                  </v-toolbar>
                                  <v-list two-line subheader>
                                      <v-list-tile v-for="player in game.player">
                                          <v-list-tile-avatar>
                                              <v-icon class="grey lighten-1 white--text">star</v-icon>
                                          </v-list-tile-avatar>
                                          <v-list-tile-content>
                                              <v-list-tile-title>{{ player.pseudo }}</v-list-tile-title>
                                              <v-list-tile-sub-title>{{ player.point }}</v-list-tile-sub-title>
                                          </v-list-tile-content>
                                      </v-list-tile>
                                  </v-list>
                          </v-card>
                      </v-flex>

                      <v-flex sm6 v-if="game.player.length == 2">
                          <v-card color="primary">
                                  <v-toolbar color="light-blue" dark flat>
                                      <v-toolbar-title>{{ i18n.stats.allparty }}</v-toolbar-title>
                                      <v-spacer></v-spacer>
                                  </v-toolbar>
                                  <v-list two-line subheader>
                                      <v-list-tile>
                                          <v-list-tile-avatar>
                                              <v-icon class="grey lighten-1 white--text">group</v-icon>
                                          </v-list-tile-avatar>
                                          <v-list-tile-content>
                                              <v-list-tile-title>{{ stats.players || 0 }}</v-list-tile-title>
                                              <v-list-tile-sub-title>{{ i18n.stats.online }}</v-list-tile-sub-title>
                                          </v-list-tile-content>
                                      </v-list-tile>
                                      <v-list-tile>
                                          <v-list-tile-avatar>
                                              <v-icon class="grey lighten-1 white--text">games</v-icon>
                                          </v-list-tile-avatar>
                                          <v-list-tile-content>
                                              <v-list-tile-title>{{ stats.party || 0 }}</v-list-tile-title>
                                              <v-list-tile-sub-title>{{ i18n.stats.party }}</v-list-tile-sub-title>
                                          </v-list-tile-content>
                                      </v-list-tile>
                                  </v-list>
                          </v-card>
                      </v-flex>
              </v-layout>
          </v-container>
      </v-content>

      <!-- Footer -->
      <v-footer height="auto" class="grey darken-3">
          <v-layout row wrap justify-center>
              <v-flex xs12 py-3 text-xs-center white--text>
                  &copy;2018 — <strong>Ealen</strong> - Rudy Marchandise
              </v-flex>
          </v-layout>
      </v-footer>
  </v-app>
</template>

<script>
  import FR from '../lang/fr.js'
  import EN from '../lang/en.js'
  import clipboard from 'clipboard'
  import qrious from 'qrious'

  /* Components */
  import qrcodeView from './components/qrcode.vue'

  /* Copy link */
  new clipboard('.btn-copy-link')

  /* Icons */
  var blinkIconAnimation = 0
  var blinkIconArray = ['far fa-hand-rock', 'far fa-hand-paper', 'far fa-hand-scissors', 'fas fa-question']

  /* VueJS */
  export default {
    components: { qrcodeView },
    mounted() {
      /* Join session */
      var joinSessionElement = document.getElementById("join-session-id")
      if(joinSessionElement) {
        this.$socket.emit('join', {session :joinSessionElement.innerText})
      }

      /* Animation */
      var self = this
      var funcChangeIcon = function () {
        if (blinkIconAnimation >= blinkIconArray.length - 1) {
            blinkIconAnimation = 0
        } else {
            blinkIconAnimation++
        }
        self.blinkIcon = blinkIconArray[blinkIconAnimation]
        setTimeout(function () {funcChangeIcon()}, 200)
      }
      funcChangeIcon()
    },
    data: function () {
      return {
        lang: 'en',
        validPseudo: true,
        dialogPseudo: true,
        myPseudo: "",
        
        me: {},
        game: {},
        stats: {},
        results: {},

        myChoice: 3,
        showAction: true,
        haveChoice: {},
        snackbar: false,
        blinkIcon: "",

        qrcode: null
      }
    },
    methods: {
        setChoice: function (choice) {
            this.$socket.emit('choice', {choice})
            this.myChoice = choice
            this.showAction = false
        },
        changePseudo: function () {
            if (this.$refs.form.validate()) {
                this.dialogPseudo = false
                this.$socket.emit('changePseudo', {pseudo: this.myPseudo})
            }
        },
        setContinue: function () {
            this.myChoice = 3
            this.results = {}
            this.showAction = true
        },
        getIcon: function (choice) {
            var icon = ['far fa-hand-rock', 'far fa-hand-paper', 'far fa-hand-scissors', 'fas fa-question']
            return icon[choice]
        }
    },
    computed: {
        sharedLink: function() {
            return location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '') + '/' + this.game.session
        },
        i18n: function () {
          if (this.lang == 'fr')
            return FR
          return EN
        }
    },
    sockets:{
      connected: function(data){
        this.game = data
      },
      yourID: function(data){
        this.me = data
      },
      stats: function(data){
        this.stats = data
      },
      haveChoice: function(data){
        this.haveChoice = data
        this.snackbar = true
      },
      results: function(data){
        this.results = data
        this.showContinue = true
      }
    }
  }
</script>
