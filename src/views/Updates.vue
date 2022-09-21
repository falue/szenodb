<template>
  <div class="ma-0 fill-width fill-height">
    <div class="hero fill-width fill-height" v-if="$vuetify.breakpoint.mdAndUp"></div>

    <v-card
      class=""
      :class="$vuetify.breakpoint.smAndDown ? 'transparent fill-height ma-0 pa-0' : 'mx-auto my-4 mt-12 pa-8 pt-4'"
      :max-width="$vuetify.breakpoint.mdAndUp ? 555 : 6666"
      max-height="80%"
      :flat="$vuetify.breakpoint.smAndDown"
      style="overflow-y: auto;"
    >
      <!-- GIT LOG -->
      <v-card-title class="justify-center pb-0">Latest updates</v-card-title>

      <v-card-text class="white--text text-center ma-0 pa-0">
        <span class='overline pink--text ml-2 mr-1' style='font-style: initial; line-height:1em'>szeno&middot;DB</span>
        on <a href="https://github.com/falue/szenodb" target="_blank">github</a> @branch {{ currentBranch }}
      </v-card-text>

      <v-card-text v-if="branches.length > 1" class="white--text text-center pa-0 mt-1">
        <span class="mb-6">
          Select branch:
          <span v-for="(branch, x) in branches" :key="'key-' + x" class="ml-4">
            <input
              type="radio"
              :id="branch"
              :value="branch"
              name="branch"
              v-model="currentBranch"
            />
            <label :for="branch" class="ml-1">{{ x === 0 ? `${branch} (default)` : branch }}</label>
          </span>
        </span>
      </v-card-text>

      <ul v-if="commits && commits.length" class="mt-12 pa-0">
        <li v-for="(record, i) in commits"  :key="'key2-' + i" style="list-style:none" class="mb-4">
          {{ record.commit.message | truncate }}
          <!-- <pre>{{record}}</pre> -->
          <div class="grey--text caption">
            {{commits.length-i}}. Commit 
            <a :href="record.html_url" target="_blank" class="commit">
              {{ record.sha.slice(0, 7) }}</a>
            by
            <a :href="record.author.html_url" target="_blank" class="mr-1">
              {{ record.commit.author.name }}
            </a>
            @
            {{ record.commit.author.date | formatDate }}
          </div>
        </li>
      </ul>
      <div v-else class="italics grey--text">No commits, or repository private</div>
    </v-card>

  </div>
</template>

<script>
  export default {
    name: 'Updates',
    props: {
      auth: Boolean,
      user: Object,
    },
    components: {
    },
    
    data () {
      return {
        apiURL: "https://api.github.com/repos/falue/szenodb/commits?per_page=250&sha=",
        // apiURL: "https://api.github.com/repos/falue/digiprops-add/commits?per_page=250&sha=",
        branches: ["main"],
        currentBranch: "main",
        commits: null
      }
    },

    created: function() {
      this.fetchData();
    },

    watch: {
      currentBranch: "fetchData"
    },

    filters: {
      truncate: function(v) {
        var newline = v.indexOf("\n");
        return newline > 0 ? v?.slice(0, newline) : v;
      },
      formatDate: function(v) {
        return v.replace(/T|Z/g, " ");
      }
    },

    methods: {
      fetchData: function() {
        var xhr = new XMLHttpRequest();
        var self = this;
        xhr.open("GET", this.apiURL + self.currentBranch);
        xhr.onload = function() {
          self.commits = JSON.parse(xhr.responseText);
          console.log(self.commits[0]?.html_url);
        };
        xhr.send();
      }
    }
  }
</script>

<style scoped>
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
</style>