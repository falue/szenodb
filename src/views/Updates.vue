<template>
  <div class="ma-0 fill-width fill-height">
    <div class="hero fill-width fill-height" v-if="$vuetify.breakpoint.mdAndUp"></div>

    <v-card
      class=""
      :class="$vuetify.breakpoint.smAndDown ? 'transparent fill-height ma-0 px-4' : 'mx-auto my-4 mt-12 pa-8 pt-4'"
      :max-width="$vuetify.breakpoint.mdAndUp ? 555 : 6666"
      max-height="80%"
      :flat="$vuetify.breakpoint.smAndDown"
      style="overflow-y: auto;"
    >
      <!-- GIT LOG -->
      <v-card-title class="justify-center">Project info</v-card-title>

      <v-card-text class="white--text text-center ma-0 pa-0 mb-12">
        <span class='overline pink--text ml-2 mr-1' style='font-style: initial; line-height:1em'>szeno&middot;DB</span>
        on <a href="https://github.com/falue/szenodb" target="_blank">github</a> @branch {{ currentBranch }}
      </v-card-text>

      <v-card-text v-if="milestones && Object.keys(milestones).length > 0" class="white--text text-center pa-0 mt-1 mb-6">
        <span class="mb-6">
          Issue milestones:<br>
          <span v-for="(milestone, x) in milestones" :key="'key-' + x" class="ml-4">
            <input
              type="radio"
              :id="'milestone'+milestone"
              :value="x"
              name="milestone"
              v-model="currentMilestone"
            />
            <label :for="'milestone'+milestone" class="ml-1">{{milestone}}</label>
          </span>
        </span>
      </v-card-text>

      <div v-if="issues && issues.length">
        There 
        {{issues.length === 1 ? 'is' : 'are'}} <span class="error--text">{{issues.length}} {{issues.length === 1 ? 'issue' : 'issues'}}</span>
        on milestone "{{milestones[currentMilestone]}}":<br>
        <div v-for="(record, i) in issues"  :key="'key2-' + i" class="grey--text caption">
          <a :href="record.html_url" target="_blank">{{record.number}}</a>
          by
          <!-- <pre>{{record}}</pre> -->
          <a :href="record.user.html_url" target="_blank">
            {{ record.user.login }}</a>:
          {{record.title}}
        </div>
      <!-- <pre>{{issues}}</pre> -->
      </div>
      <div v-else>
        No issues; all done! Congrats 🥳
      </div>

      <hr class="mb-3 mt-16" style="border:none; border-top: solid 1px rgba(255,255,255,.25);">
      <v-card-title class="justify-center">Latest updates</v-card-title>

      <v-card-text v-if="branches && branches.length > 1" class="white--text text-center pa-0 mt-1">
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
          <div class="grey--text caption">
            Commit 
            <a :href="record.html_url" target="_blank">
              {{ record.sha.slice(0, 7) }}
            </a>
            by
            <a :href="record.author.html_url" target="_blank">
              {{ record.commit.author.name }}
            </a>
            @ {{ record.commit.author.date | formatDate }}
          </div>
        </li>
      </ul>
      <div v-else class="italics grey--text">No commits, or repository private</div>
      <div v-if="commits && commits.length >= 100" class="italics grey--text">
        <span class="caption">(...)</span>
        <br>
        <br>
        Showing last 100 commits.
        <a :href="`https://github.com/falue/szenodb/commits/${currentBranch}`" target="_blank">Click here</a>
        if you want to see them all.
      </div>
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
        apiUrl: "https://api.github.com/repos/falue/szenodb/commits?per_page=100&sha=",
        apiUrlIssues: "https://api.github.com/repos/falue/szenodb/issues?per_page=100&state=open&milestone=",
        apiUrlMilestones: "https://api.github.com/repos/falue/szenodb/milestones?state=open",
        // apiUrl: "https://api.github.com/repos/falue/digiprops-add/commits?per_page=250&sha=",
        branches: ["main"],
        currentBranch: "main",
        milestones: {},
        currentMilestone: 0,
        commits: null,
        issues: null,
      }
    },

    async created() {
      this.fetchData(this.apiUrlMilestones, 'milestones', '');
      this.fetchData(this.apiUrl, 'commits', this.currentBranch);
    },

    watch: {
      currentBranch() {
        this.fetchData(this.apiUrl, 'commits', this.currentBranch);
      },
      currentMilestone() {
        this.fetchData(this.apiUrlIssues, 'issues', this.currentMilestone);
      }
    },

    filters: {
      truncate(v) {
        var newline = v.indexOf("\n");
        return newline > 0 ? v?.slice(0, newline) : v;
      },
      formatDate(v) {
        return v.replace(/T|Z/g, " ");
      }
    },

    methods: {
      parseMilestones(milestones) {
        if(milestones) {
          for (let i = 0; i < milestones.length; i++) {
            if(i===0) this.currentMilestone = milestones[i].number;
            this.milestones[milestones[i].number] = milestones[i].title;
          }
        }
      },

      fetchData(url, target, theme) {
        var xhr = new XMLHttpRequest();
        var that = this;
        xhr.open("GET", url + theme);
        xhr.onload = function() {
          if(target === 'commits') {
            that.commits = JSON.parse(xhr.responseText);
          } else if(target === 'issues') {
            that.issues = JSON.parse(xhr.responseText);
          } else if(target === 'milestones') {
            that.parseMilestones(JSON.parse(xhr.responseText));
            that.fetchData(that.apiUrlIssues, 'issues', that.currentMilestone);
          }
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