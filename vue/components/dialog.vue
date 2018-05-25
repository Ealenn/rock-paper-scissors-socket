<template>
    <v-dialog v-model="dialogPseudo" max-width="500px" persistent>
        <v-card text-xs-center>
            <v-card-media
                src="/img/joystick.png"
                height="100px"
            >
            </v-card-media>
            <v-card-title>
                <h3>{{ $t('username.title') }}</h3>
            </v-card-title>

            <v-card-text style="padding-top:0">
                    

                    <v-container grid-list-md text-xs-center>
                        <v-layout row wrap>
                            <v-flex xs6>
                                    <v-btn depressed :disabled="locale == 'fr'" @click="changeLocal('fr')">
                                        <span class="flag-icon flag-icon-fr mr-2"></span>
                                        Français
                                    </v-btn>
                            </v-flex>
                            <v-flex xs6>
                                    <v-btn depressed :disabled="locale == 'en'" @click="changeLocal('en')">
                                        <span class="flag-icon flag-icon-gb mr-2"></span>
                                        English
                                    </v-btn>
                            </v-flex>
                        </v-layout>
                    </v-container>


                    <v-form ref="form" v-model="validPseudo" v-on:submit.prevent="changePseudo()" lazy-validation>
                        <v-text-field
                            v-model="myPseudo"
                            :rules="[v => !!v || $t('username.errors.required'), v => v.length <= 10 || $t('username.errors.length')]"
                            counter="10"
                            :label="$t('username.field')"
                            required
                        ></v-text-field>
                    
                        <div class="text-xs-center">
                            <v-btn
                                depressed
                                color="primary"
                                :disabled="!validPseudo"
                                @click="changePseudo()"
                            >
                                {{ $t('username.submit') }}
                            </v-btn>
                            <v-btn flat @click="myPseudo = ''">{{ $t('username.clear') }}</v-btn>
                        </div>
                    </v-form>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
  import qrious from 'qrious'

  export default {
    data: function () {
      return {
        validPseudo: true,
        dialogPseudo: true,
        myPseudo: "",
      }
    },
    methods: {
        changePseudo: function () {
            if (this.$refs.form.validate()) {
                this.dialogPseudo = false
                this.$socket.emit('changePseudo', {pseudo: this.myPseudo})
            }
        },
        changeLocal: function (local) {
            this.$i18n.locale = local
        }
    },
    computed: {
        locale: function () {
            return this.$i18n.locale
        }
    }
  }
</script>
