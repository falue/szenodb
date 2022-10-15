<template>
  <div>
    <!-- BUTTON -->
    <div
      style="display:inline-block; padding: .4em .6em .4em .4em"
      class="v-btn theme--dark v-btn--contained file_input ma-0 mb-2"
      relative
      :class="{'btn--disabled' : dataLength > 0, 'grey darken-3': parsingCsv}"
    >
      <input type="file" ref="csvFileInput" @change="readCsvFile" accept="text/csv" :disabled="dataLength > 0 || parsingCsv" title="">
      <span class="caption">
        <v-icon class="mr-1" small>mdi-upload</v-icon>
        {{fileName ? $helpers.ellipsis(fileName, 16, '..', true) : 'Upload .csv'}}
        <v-icon v-if="parsingCsv" @click="abort = true" small class="ml-4 red--text">mdi-close</v-icon>
      </span>
      <v-progress-linear
        v-if="parsingCsv" 
        indeterminate
        color="primary"
        height="2"
        class="absolute bottom left"
        style="display: inline-block"
      ></v-progress-linear>
    </div>

    <!-- HINT -->
    <v-tooltip :v-if="$vuetify.breakpoint.smAndUp" top :open-on-hover="false" :open-on-focus="false"
      color="#303030"
    >
      <template v-slot:activator="{ on, attrs }">
        <!-- <v-btn class="primary--text" v-bind="attrs" v-on="on" >
          <v-icon color="primary" small>mdi-help</v-icon>
        </v-btn> -->
        <v-btn icon v-bind="attrs" v-on="on" color="primary" class="mr-2 mb-2">
          <v-icon color="primary" small>mdi-help</v-icon>
        </v-btn>
      </template> 
      <span>
        Export your resources from Excel or Numbers in the <pre style="display:inline">csv</pre> format.<br>
        The columns have to be <span class="red--text">exactly</span> in this order:<br>

        <table style="width:100%" class="my-2" :style="$vuetify.breakpoint.xs ? 'font-size:0.85em': ''">
          <thead>
            <tr class="primary--text">
              <th  v-for="(header, x) in ['Title','Contact','Resources','Opinions','Address','Tel','Email','Website']" :key="x">
                {{ header }}</th>
            </tr>
          </thead>
          <tbody>
              <tr>
                <td>...</td>
                <td>...</td>
                <td>...</td>
                <td>...</td>
                <td>...</td>
                <td>...</td>
                <td>...</td>
                <td>...</td>
              </tr>
              <tr class="grey--text text--darken-1">
                <td>...</td>
                <td>...</td>
                <td>...</td>
                <td>...</td>
                <td>...</td>
                <td>...</td>
                <td>...</td>
                <td>...</td>
              </tr>
          </tbody>
        </table>

        <!-- This file *DOES* work when nom run build & served online! -->
        <a href="./downloads/ExampleFile.xlsx" download>
          <v-icon small class="no-underline primary">mdi-download</v-icon>
          ExampleFile.xlsx
        </a>
        <br>
        <div>
          When exporting as <pre style="display:inline">.csv</pre>, be sure to :
          <div class="italics">
            - set the Field delimeter to <code>,</code> (comma) <br>
            - uncheck "Fixed column width"
          </div>
        </div>
      </span>
    </v-tooltip>

    <!-- GUI DOUBLE CHECK DATA -->
    <v-dialog
      v-model="csvDialog"
      width="90%"
      :fullscreen="$vuetify.breakpoint.xs"
    >
      <v-card :flat="$vuetify.breakpoint.smAndUp">
        <v-card-title class="text-h5 grey darken-3">
          Double check your data {{$vuetify.breakpoint.smAndUp ? 'please' : ''}}
        </v-card-title>

        <v-card-text class="my-4 " >
          Does this look correct to you?
          <div :style="$vuetify.breakpoint.xs ? 'width:100%; overflow: auto': ''">
          <table style="width:100%" class="my-4 ">
            <thead>
              <tr class="primary--text">
                <th  v-for="(header, x) in ['Title','Contact','Resources','Opinions','Address','Tel','Email','Website']" :key="x">
                  {{ header }}</th>
              </tr>
            </thead>
            <tbody>
                <tr v-for="(row, i) in checkCsvData.filter(element => {return element;})" :key="i">
                  <td>{{row[0]}}</td>
                  <td>{{row[1]}}</td>
                  <td>{{row[2]}}</td>
                  <td>{{row[3]}}</td>
                  <td>{{row[4]}}</td>
                  <td>{{row[5]}}</td>
                  <td>{{row[6]}}</td>
                  <td>{{row[7]}}</td>
                </tr>
                <tr class="grey--text text--darken-1">
                  <td>...</td>
                  <td>...</td>
                  <td>...</td>
                  <td>...</td>
                  <td>...</td>
                  <td>...</td>
                  <td>...</td>
                  <td>...</td>
                </tr>
            </tbody>
          </table>
          </div>

          <p class="primary--text">Please double-check if the column headers match your data.</p>

          Once you hit ok theres only manual labor what makes it okay again.
          If the data does not correspond with the headers, please adjust your csv and try again.
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions center>
          <v-btn
            class="red"
            text
            @click="csvDialog = false"
          >
            <span v-if="$vuetify.breakpoint.smAndUp">No, i need to make changes to the .csv</span>
            <span v-else>Abort</span>
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            class="primary"
            text
            @click="csvDialog = false; doublechecked = true; parseCsvFile(fileInput)"
          >
            Yes, please insert <span v-if="$vuetify.breakpoint.smAndUp">into list</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  export default {
    props: ['data', 'dataMode'],
    components: {
    },
    data() {
      return {
        fileInput: '',
        fileName: '',
        abort: false,
        dataLength: 0,
        parsingCsv: false,
        csvDialog: false,
        checkCsvData: [],
        doublechecked: false,
      }
    },
    watch: {
      fileInput: function (data) {
        if (data.length) {
          this.parseCsvFile(data);
        }
      },
    },

    methods: {
      /* PARSE CSV */
      readCsvFile(event) {
        this.fileName = event.target.files[0].name;
        let files = event.target.files || event.dataTransfer.files;
        if (!files.length) return;
        let reader = new FileReader();
        let vm = this;
        vm.fileInput = '';  // reset
        reader.onload = () => {
          vm.fileInput = reader.result;
        };
        reader.readAsText(files[0]);
      },

      async parseCsvFile(text) {
        this.parsingCsv = true;
        let csvParsed = await this.$papa.parse(text, {preview: this.doublechecked ? 0 : 4, skipEmptyLines: true})

        // file had errors?
        if(csvParsed.errors.length) {
          for(let i = 0; i < csvParsed.errors.length; i++){
            this.$toasted.global.info({msg:csvParsed.errors[i].message});
            if(csvParsed.errors[i].type === 'MissingQuotes') {
              // Abort if some quote was missing.
              this.$toasted.global.error({msg:`${csvParsed.errors.length} Error(s): No users were added.`});
              this.dataLength = 0;
              this.parsingCsv = false;
              this.fileName = '';
              this.abort = false;
              this.doublechecked = false;
              return
            }
          }
        }
        // Remove first entry if first cell of first row is "title" or "titel"
        if(csvParsed.data[0][0].toLowerCase() === "title" || csvParsed.data[0][0].toLowerCase() === "titel") {
          csvParsed.data.shift();
        }

        if(!this.doublechecked) {
          // double check
          // do the GUI check..
          this.checkCsvData = csvParsed.data;
          this.checkCsvData.length=3;  // remove 4th item if there was no title header
          this.csvDialog = true
        } else {
          // add csv to list
          await this.csvToList(csvParsed.data);
        }


        // reset
        this.dataLength = 0;
        this.parsingCsv = false;
        this.fileName = '';
        this.abort = false;
        this.doublechecked = false;
        return;
      },

      async csvToList(data) {
        this.$emit('csvImporting', [0,data.length]);
        let counter = 0;
        // data.reverse();
        // let doublechecked = false;
        for (let i = 0; i < data.length; i++) {
          if(this.abort) break;
          let newResource = {};
          newResource.title = data[i][0] ? this.$helpers.stripHtml(data[i][0]) : '';
          if(newResource.title.toLowerCase() === 'title' || !newResource.title) continue;
          newResource.name = data[i][1] ? this.$helpers.stripHtml(data[i][1]) : '';
          newResource.resources = data[i][2] ? this.$helpers.stripHtml(data[i][2]) : '';
          newResource.info = data[i][3] ? this.$helpers.stripHtml(data[i][3]) : '';
          newResource.address = data[i][4] ? this.$helpers.stripHtml(data[i][4]) : '';
          newResource.tel = data[i][5] ? this.$helpers.stripHtml(data[i][5]) : '';
          newResource.email = data[i][6] ? this.$helpers.stripHtml(data[i][6]) : '';
          newResource.web = data[i][7] ? this.$helpers.stripHtml(data[i][7]) : '';
          newResource.imgs = [];
          newResource.rating = 0;
          newResource.hiddenNote = "CSV import";

          await this.$store.dispatch('addResource', {"collection": "resources", "post": newResource})
          counter++;
          this.$emit('csvImporting', [counter,data.length]);
        }
        if (counter > 0) {
          this.$toasted.global.success({msg:`Successfully added ${counter} entries.`});
          this.$emit('csvImporting', [0,0]);
          //this.resetSearch();  // reload the list...?
        } else {
          this.$toasted.global.info({msg:"No users were added."});
        }
      },
    }
  }
</script>

<style scoped>
  /* allow for click in tooltip (bc of link in it) */
  .v-tooltip__content {
    pointer-events: initial;
  }
  table {
    border-collapse: separate;
    border-spacing: 0;
  }
  th {
    background-color: #444444;
  }
  td, th {
    border-right: grey thin solid;
    border-top: grey thin solid;
  }
  td {
    max-width: 1px;
    padding: 0 0.5em;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  table {
    border-left: grey thin solid;
    /* border-top: grey thin solid; */
  }
</style>
