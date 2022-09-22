<template>
  <div class="ma-0 fill-width fill-height">
    <div class="hero fill-width fill-height" v-if="$vuetify.breakpoint.mdAndUp"></div>

    <v-card
      :class="$vuetify.breakpoint.smAndDown ? 'transparent fill-height ma-0 pa-0' : 'mx-auto my-4 mt-12 pa-8 pt-4'"
      :max-width="$vuetify.breakpoint.mdAndUp ? 666 : 6666"
      max-height="80%"
      style="overflow-y: auto;"
    >
      <v-card-title class="justify-center">
        <v-icon color="pink">mdi-cupcake</v-icon>
        <span class="mx-4">Goodies</span>
        <!-- <v-icon color="pink">mdi-ice-pop</v-icon> -->
      </v-card-title>

      <v-card-subtitle class="grey--text text-center">
          Stuff good to know, nice to have and better to share
      </v-card-subtitle>

      <v-card-text class="white--text">
        <p>
          This is an unordered, curated list of useful internet things
          for your workflow on the field, on the computer or when you write your bill.
        </p>

        <p>
          Unless otherwise specified, everything here is
          <span class="success--text italics">fair use, copyright free and free to use</span>.
        </p>

        <p>
          This list might change abruptly, and if you never want to forget links on here, bookmark them.
        </p>

        <!-- MENU -->
        <div style="line-height:1em" class="fill-width pt-12 grey--text text-h6 pb-2">
          Chapters
        </div>
        <template v-for="(card, n) in cards">
          <!-- <div :key="n" v-if="card.chapter" class="pointer mb-2" @click="goto(`chapter-${n}`)">{{card.chapter}}</div> -->
          <div :key="n" v-if="card.chapter" class="pointer mb-2 primary--text" @click="goto(`chapter-${n}`)">- {{card.chapter}}</div>
        </template>

        <v-row>
          <template v-for="(card, n) in cards" >
            <!-- CHAPTER TITLE -->
            <div :id="`chapter-${n}`" :key="n" v-if="card.chapter" class="fill-width">
              <hr class="mb-3 mt-16" style="border:none; border-top: solid 1px rgba(255,255,255,.25);">
              <v-card-title class="justify-center">{{card.chapter}}</v-card-title>
            </div>

            <v-col :key="n" v-else cols="12" xs="12" sm="6" md="6">

              <!-- CARDS -->
              <v-card
                class="hover--grey px-4 py-0 pb-2"
                outlined
              >
              <!-- :class="card.color ? card.color + ' darken-4 darken-4' : ''" -->
                <v-list-item class="ma-0 pa-0">
                  <v-list-item-title>
                    {{card.title}}
                  </v-list-item-title>
                  <v-icon  v-if="card.dialog.text.length" :color="!card.dialog.icon ? 'yellow' : 'primary'" @click="showDialog({title: card.dialog.title, text: card.dialog.text})">mdi-{{card.dialog.icon ? card.dialog.icon : 'alert'}}</v-icon>
                </v-list-item>
                <v-card-text v-if="card.desc.length" class="ma-0 pa-0">
                  {{card.desc}}
                </v-card-text>
                <div v-if="card.web.length > 0">
                  <v-card-actions v-for="(web, n) in card.web" :key="n" class="ma-0 pa-0 pt-2">
                    <a  :href="web" style="text-overflow: ellipsis; white-space:pre; overflow:hidden;" target="_blank">{{displayUrl(web)}}</a>
                    <!-- <a  v-if="web.startsWith('./') && web.endsWith('.html')" :href="web.replace('/index.html','')" download target="_blank">{{$helpers.retrieveDomain(web).replace('./downloads/', '').replace('./goodies/', '').replace('./', '').replace('/index.html', '.zip')}}</a> -->
                  </v-card-actions>
                </div>
                <v-card-actions v-else class="ma-0 pa-0 pt-2 grey--text italics">
                  [Link pending]
                </v-card-actions>
              </v-card>
            </v-col>
          </template>
        </v-row>

        <!-- FOOTER -->
        Get in contact if you want to add to this list:
        <br v-if="$vuetify.breakpoint.smAndDown">
        <a href="tel:0787424834" v-if="$vuetify.breakpoint.smAndDown" title="call" class="no-underline" :class="{'bigMobileButton mr-2' : $vuetify.breakpoint.smAndDown}">
          <v-icon :small="$vuetify.breakpoint.mdAndUp" class="pa-1" color="grey">mdi-phone</v-icon>
        </a>
        <a href="mailto:info@fluescher.ch" title="write email" class="no-underline" :class="{'bigMobileButton mr-2' : $vuetify.breakpoint.smAndDown}">
          <v-icon :small="$vuetify.breakpoint.mdAndUp" class="pa-1" color="grey">mdi-email</v-icon>
        </a>
        <a href="https://github.com/falue/szenodb" title="github repo" target="_blank" class="no-underline no-before" :class="{'bigMobileButton mr-2' : $vuetify.breakpoint.smAndDown}">
          <v-icon :small="$vuetify.breakpoint.mdAndUp" class="pa-1" color="grey">mdi-github</v-icon>
        </a>
      </v-card-text>

    </v-card>

    <v-dialog
      v-model="infoDialog.model"
      :width="$vuetify.breakpoint.smAndDown ? '80%' : '45%'"
      :fullscreen="$vuetify.breakpoint.xs"
    >
      <v-card>
        <v-card-title v-if="infoDialog.title" class="text-h5 grey darken-3">
          {{infoDialog.title}}
        </v-card-title>
        <v-card-text class="my-4 white--text" :class="infoDialog.title ? '' : 'pt-4'" v-html="infoDialog.text">
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="infoDialog.model = false">
            <span>Close</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  export default {
    name: 'About',
    props: {
      auth: Boolean,
      user: Object,
    },
    
    data () {
      return {
        infoDialog: {
          'model': false,
          'title': '',
          'text': '',
        },
        cards: [
          {'chapter':'Filler material: Names, contacts, words and papers'},

          {'title':`Fake contact generator`,
           'desc':`Generate a gajillion vcards (contact files) for mobile or dekstop with lots of options. Python script - requieres 'programming'.`,
           'web':[`./downloads/vcard_generator.zip`],
           'color':'indigo', 'dialog': {'title': ``, 'text': ``}
          },

          {'title':`Download random contacts`,
           'desc':`10, 100 & 1000 contacts with swiss names, sometimes with user image, sometimes with title of nobility, etc.`,
           'web':[`./downloads/vcards.zip`],
           'color':'pink darken-2', 'dialog': {'title': `Beware!`,
           'text': `As this is randomly generated, some person with those first/lastname might exist! Same with the phone numbers: Its very likely that those exist aswell.<br><br>Beware when importing these contacts to your phone. They look like the real deal! They have a note though in them, reading "vcard_generator", so you can search for that and delete contacts with that note.`}
          },

          {'title':`Online name generator`,
           'desc':`Simple, but most practical name, email and random tech words generator for film purposes. Mainly swiss names.`,
           'web':[`./goodies/namegenerator/index.html`],
           'color':'warning', 'dialog': {'title': ``, 'text': ``}
          },

          {'title':`More name generators`,
           'desc':`Generators with telephone, birthdays, banc account, prehistoric names, latin, scifi, or 'cool' names, etc.`,
           'web':[`https://de.fakenamegenerator.com/gen-random-gr-sz.php`, `https://randomwordgenerator.com/name.php`, `https://orteil.dashnet.org/randomgen/?gen=names.txt`],
           'color':'green', 'dialog': {'title': ``, 'text': ``}
          },

          {'title':`Random file collection`,
           'desc':``,
           'web':[],
           'color':'deep-purple accent-4', 'dialog': {'title': ``, 'text': ``}
          },

          {'title':`Esotheric Bullshit`,
           'desc':``,
           'web':[`https://sebpearce.com/bullshit/`],
           'color':`indigo`,
           'dialog': {'title': ``, 'text': ``}
          },

          {'title':`Bullshit papers`,
           'desc':`Create scientific papers with your name on it. Needs Firefox, and sadly in this version there are some images missing.`,
           // check out https://github.com/davidpomerenke/scigen.js
           'web':[`https://davidpomerenke.github.io/scigen.js/`, `./downloads/bullshitPaperExamples.zip`],
           'color':`warning`,
           'dialog': {'title': ``, 'text': ``}
          },

          {'chapter': 'Images & image generation'},

          {'title':`Copyright free images & data`,
           'desc':``,
           'web':[`https://pixy.org/`, `https://www.pexels.com/de-de/`, `https://wordpress.org/openverse/?referrer=creativecommons.org`],
           'color':`pink darken-2`,
           'dialog': {'title': ``, 'text': ``}  
          },

          {'title':`Collection of 400 portraits`,
           'desc':`Copyright-free images of real people, hand-picked.`,
           'web':[`./downloads/randomUserImagesMale.zip`, `./downloads/randomUserImagesFemale.zip`],
           'color':`pink darken-2`,
           'dialog': {'title': ``, 'text': ``}
          },

          {'title':`Random desktop image collection`,
           'desc':`Small but useful.`,
           'web':[`./downloads/desktops.zip`],
           'color':'deep-purple accent-4', 'dialog': {'title': ``, 'text': ``}
          },

          {'title':`Image glitcher`,
           'desc':`Make an image look like its *seen* things.`,
           'web':[`https://www.airtightinteractive.com/demos/js/imageglitcher/`],
           'color':'indigo', 'dialog': {'title': ``, 'text': ``}
          },

          {'title':`City map generator `,
           'desc':`Create images (rasterized or vector) of cities that don't exist.`,
           'web':[`https://probabletrain.itch.io/city-generator`],
           'color':'warning', 'dialog': {'title': ``, 'text': ``}
          },

          {'title':`Satellite images`,
           'desc':`Somewhat cumbersome user interface, it is possible to get copyright free satellite images here.`,
           'web':[`https://earthexplorer.usgs.gov/`],
           'color':'pink darken-2', 'dialog': {'title': ``, 'text': ``}
          },

          {'title':`This person does not exist`,
           'desc':`AI generated portraits, art, cats. Beware of possible copyright!`,
           'web':[`https://thispersondoesnotexist.com/`, 'https://thisartworkdoesnotexist.com/', 'https://thisxdoesnotexist.com/'],
           'color':'green', 'dialog': {'title': `A.I generated images`,
           'text': `The copyright of images made by an A.I. is somewhat disputed.<br>However, what is'nt, is that someone wrote the software, hit 'generate' with this software, curated and hand picked a list, made a website and uploaded them into his or her server which makes them different from when you would hit the button in the software yourself.<br><br>&quot;The computer programs responsible for autonomously generating works are the result of human ingenuity, their source code may be copyrighted as a literary work under the U.S. Copyright Act.<br>The artworks generated by such programs, however, are not copyrightable if not directly influenced by human authors. One example given by the U.S. Copyright Office is a “weaving process that randomly produces irregular shapes in the fabric without any discernible pattern.” Since chance, rather than the programmer of this “weaving machine”, is directly responsible for its work, the resulting patterns would not be protected by U.S. copyright. Randomness, just like autonomously learned behavior is something that cannot be attributed to the human programmer of an AI machine.&quot;<br><br><a href='https://ipmall.law.unh.edu/sites/default/files/hosted_resources/IDEA/hristov_formatted.pdf' target='_blank'>Heres the PDF</a> if you're interested.<br>Someone on the internet says <a href='https://qr.ae/pvOd0M' target='_blank'>this</a>, someone says <a href='https://www.reddit.com/r/COPYRIGHT/comments/ldlm3x/can_i_legally_use_faces_from_this_person_does_not/?utm_source=share&utm_medium=web2x&context=3' target='_blank'>that</a>.`}
          },

          {'chapter': 'Digital props'},

          {'title':`HACKING`,
           'desc':`Only for non-serious movies. Content is exaggerated beyond recognition.`,
           'web':[`https://hackertyper.net/`, `http://geektyper.com/`],
           'color':'deep-purple accent-4', 'dialog': {'title': `I'm not joking.`,
           'text': `This is fun & games, but everyone who ever has written a line of code, this is comically unrealistic.`}
          },

          {'title':`telefabi.ch terminal`,
           'desc':`Look like you can code. Available offline aswell.`,
           'web': [`./goodies/terminal/index.html`],
           'color':`indigo`,
           'dialog': {'title': ``, 'icon':'information-outline', 'text': `On the top right there is a menu button hidden. Click it for settings or adjustments.`}
          },

          {'title':`telefabi.ch bash console`,
           'desc':`Pre-determined animation of a console. Customizable only in offline mode.`,
           'web': [`./goodies/bash/index.html?script=1&workstation=examples&darkMode=true`, `./goodies/bash/index.html?script=2&workstation=examples&darkMode=true`],
           'color':`warning`,
           'dialog': {'title': ``, 'icon':'information-outline', 'text': `On the top right there is a menu button hidden. Click it for settings or adjustments.`}
          },

          {'title':`telefabi.ch Eddy-G`,
           'desc':`MAC/WIN/Linux program that runs a browser on a local server for displaying my tools offline.`,
           'web':[],
           'color':`pink darken-2`,
           'dialog': {'title': ``, 'text': ``}
          },

          {'title':`telefabi.ch html desktop`,
           'desc':`Virtual desktop. Make MAC look like Linux or Windows, but copyright free, and vice-versa. Lots of customization. Customizable only in offline mode.`,
           'web':[],
           'color':`green`,
           'dialog': {'title': ``, 'text': ``}
          },

          {'title':`telefabi.ch videoplayer`,
           'desc':`Fullscreen video player with perfect looping, chapters, play pause, delays, etc. Available offline aswell.`,
           'web':[`./goodies/video/index.html`, './downloads/video.zip'],
           'color':`deep-purple accent-4`,
           'dialog': {'title': ``, 'icon':'information-outline', 'text': `On the top right there is a menu button hidden. Click it for settings or adjustments.`}
          },

          {'title':`threejs.org 3d viewer`,
           'desc':`Load 3d files and manipulate them.`,
           'web': [`https://threejs.org/editor/`, 'https://github.com/mrdoob/three.js/archive/master.zip'],
           'color':`deep-purple accent-4`,
           'dialog': {'title': ``, 'text': ``}
          },

          {'title':`telefabi.ch color marker`,
           'desc':`Green/Blue screens with adjustable sizes & markers. Fullscreen colorplate with markers (or without). Available offline aswell.`,
           'web':[`./goodies/colorMarker/index.html`, './downloads/colorMarker.zip'],
           'color':`pink darken-2`,
           'dialog': {'title': ``, 'icon':'information-outline', 'text': `On the top right there is a menu button hidden. Click it for settings or adjustments.`}
          },

          {'title':`Greenscreen images`,
           'desc':`For the absolute worst solution of green on screens, here is a collection of fix-sized images. check out the color marker for variable size screens.`,
           'web':[`./downloads/greenScreenImages.zip`],
           'color':'green', 'dialog': {'title': ``, 'text': ``}
          },

          {'title':`proto.io`,
           'desc':`Best suite for generating fake apps. Paywall included but simple and kinda powerful.`,
           'web':[`https://proto.io`],
           'color':'indigo', 'dialog': {'title': ``, 'text': ``}
          },

          {'chapter': 'Work: Your rights; jobs & money'},
          
          {'title':`SSFV`,
           'desc':`Trade association of movie professionals. Salaries and conditions of employment.`,
           'web':[
             'https://www.ssfv.ch/',
             './downloads/aab--tagesengagement-2014.pdf',
             './downloads/aab--wochenengagement-2020.pdf',
             './downloads/empfohlene-richtloehne--wochen--2016.pdf',
             './downloads/richtloehne-tagesengagement.pdf',
           ],
           'color':`pink darken-2`,
           'dialog': {'title': ``, 'text': ``}
          },
          
          {'title':`t.punkt - ACT`,
           'desc':`Trade association of theater professionals. Salaries and conditions of employment.`,
           'web':[
             'https://www.tpunkt.ch/',
             './downloads/ACT_Richtgagen-und-Richtloehne.pdf',
           ],
           'color':`pink darken-2`,
           'dialog': {'title': ``, 'text': ``}
          },
          
          {'title':`Job Markets`,
           'desc':``,
           'web':[
             'https://www.theaterschweiz.ch/stellenmarkt/',
             'https://studentenjobs.ch/inserat?query=film',
             'https://studentfilm.ch/',
             'https://www.451.ch/451-F//User-Beitraege/Bezahlte-Arbeit',
           ],
           'color':`pink darken-2`,
           'dialog': {'title': ``, 'text': ``}
          },

          {'title':`Reisespesenbelege (iOS)`,
           'desc':`Easy way on the road to regularly have your bills up to date and scan receipts with your phone. Makes a .pdf with the statement and the receipts in the end.`,
           'web':[`https://apps.apple.com/ch/app/reisespesenbelege/id703187946`],
           'color':`warning`,
           'dialog': {'title': ``, 'text': ``}
          },

          {'chapter': 'Haptic & various'},

          {'title':`RGB, NCS, RAL converter`,
           'desc':`Convert RGB values to the nearest standard colour. Useful for matching digital colors to wall paint.`,
           'web':[`https://www.e-paint.co.uk/convert-rgb.asp`],
           'color':'warning', 'dialog': {'title': ``, 'text': ``}
          },

          {'title':`Cadrage (iOS)`,
           'desc':`Insert camera & lense and get an approximation what will be in shot and what may not.`,
           'web':[`https://apps.apple.com/app/cadrage-directors-viewfinder/id793232740`],
           'color':'pink darken-2', 'dialog': {'title': ``, 'text': ``}
          },
          
          {'title':`DOF calculator`,
           'desc':`Get a sense of which lense shows what in what distance.`,
           'web':[`https://dofsimulator.net/en/`],
           'color':'pink darken-2', 'dialog': {'title': ``, 'text': ``}
          },

          {'title':`Materials weight calculator`,
           'desc':`Calulcate weight of aluminium, wood, acrylics, etc`,
           'web':[`https://schreinerwissen.de/kg.php`],
           'color':'green', 'dialog': {'title': ``, 'text': ``}
          },

          {'title':`Deepl Translator`,
           'desc':`Translate text fast and pretty accurate.`,
           'web':[`https://www.deepl.com/de/translator`],
           'color':`warning`,
           'dialog': {'title': ``, 'text': ``}
          },

          {'title':`Sun surveyor (Android/iOS)`,
           'desc':`Get sun and moon positions now or in the future with your phones camera. Know what the light looks like on location, before being there.`,
           'web':[`https://play.google.com/store/apps/details?id=com.ratana.sunsurveyor`, 'https://apps.apple.com/us/app/sun-surveyor/id525176875'],
           'color':`warning`,
           'dialog': {'title': ``, 'text': ``}
          },

          {'title':`Open workshops in Zürich`,
           'desc':``,
           'web':['https://zurich.fablab.ch/', 'https://bitwaescherei.ch/', 'https://wiki.sgmk-ssam.ch/index.php/OpenLab'],
           'color':`pink darken-2`,
           'dialog': {'title': ``, 'text': ``}
          },

          {'title':`Material Icons`,
           'desc':`Google Material design guidelines is something to behold. Get system & GUI images uniform, battle-proven and beautiful - we use them on this site.`,
           'web':['https://fonts.google.com/icons', 'https://github.com/google/material-design-icons/tree/master/font', './downloads/materialIcons.zip'],
           'color':`pink darken-2`,
           'dialog': {'title': ``, 'text': ``}
          },

          /* {'title':``,
           'desc':``,
           'web':[],
           'color':`pink darken-2`,
           'dialog': {'title': ``, 'text': ``}
          }, */
        ]
      }
    },

    methods: {
      displayUrl(web) {
        return this.$helpers.retrieveDomain(web)
          .replace('./downloads/', '')
          .replace('./goodies/', '')
          .replace('./', '')
          .replace('play.google.com', 'Google Play Store')
          .replace('apps.apple.com', 'Apple Store')
      },
      showDialog(data) {
        this.infoDialog.model = true;
        this.infoDialog.text = data.text;
        this.infoDialog.title = data.title ? data.title : '';
      },
      goto(refName) {
        /* console.log(this.$refs);
        var element = this.$refs[refName];
        var top = element.offsetTop;
        window.scrollTo(0, top); */
        document.getElementById(refName).scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
      }
    }

  }
</script>

<style scoped>
  body {
    scroll-behavior: smooth;
  }
  .hero {
    background: url('../assets/about.jpg');
    background-size: cover;
    background-repeat: no-repeat;
    background-position: 50% 50%;
    height: 100vh;
    position: fixed;
    left:0;
    top:0;
    opacity: .25;
    filter: saturate(0);
  }

  .hover--grey:hover {
    background-color: #282828;
  }

  a:not(.no-before):before {
    margin-right: 0.25em;
    font-size: 1.25em;
    font-family: "Material Design Icons";
    text-decoration:none;
    display:inline-block;
    transform: translateY(.1em);
  }
  a.no-before:before {
    display: none;
  }

  a[href^="http"]:before {
    content: '\F03CC' /* open in new */
  }
  a[href^="/"]:before,
  a[href^="../"]:before,
  a[href^="./"]:before {
    /* content: '\F1462' download box */
    content: '\F01DA' /* download arrow */
  }

a[href$="py"]:before,
a[href$="html"]:not[href^="http"]:before {
  content: "\F102B";  /* file code outline */
}
a[href*=".html"][href^="./"]:before {
  content: "\F0206";  /* exit-to-app */
}
a[href^="http"][href$="zip"]:before {
  content: '\F01DA' /* download arrow */
  /*content: "\F07B9";  /* folder zip outline */
}
</style>