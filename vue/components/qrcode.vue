<template>
    <v-card>
            <v-toolbar color="light-blue" dark flat>
                <v-toolbar-title>{{ $t('qrcode.title') }}</v-toolbar-title>
                <v-spacer></v-spacer>
            </v-toolbar>
            
            <v-card-title primary-title>
                <div style="margin:auto">
                    <canvas id="qrcode"></canvas>
                    <hr>
                    <h4>{{ $t('qrcode.description') }}</h4>
                </div>
            </v-card-title>
    </v-card>
</template>

<script>
  import qrious from 'qrious'

  export default {
    props: {
        link: String
    },
    mounted() {
        this.generate()
    },
    updated() {
        this.generate()
    },
    data: function () {
      return {
          qrcode: null
      }
    },
    methods: {
        generate: function () {
            this.qrcode = new qrious({
                element: document.getElementById('qrcode'),
                level: 'H',
                size: 300,
                value: this.link
            });
        }
    }
  }
</script>
