<template>
    <!-- SIGNUP FORM -->
    <v-card
      :class="$vuetify.breakpoint.xs ? 'transparent fill-height ma-0 pa-4' : 'mx-auto my-4 mt-12 pa-8'"
      :max-width="$vuetify.breakpoint.smAndUp ? 344 : 6666"
      max-height="80%"
      :flat="$vuetify.breakpoint.smAndUp"
      style="overflow-y: auto;"
    >
      <v-card-title class="justify-center">Sign up <span class="pink--text ml-1">(always free)</span></v-card-title>
      <v-form @submit.prevent v-model="validForm">
          <v-text-field filled v-model.trim="signupForm.name" type="text" placeholder="Name*" id="name" autocomplete="username"></v-text-field>
          <v-text-field filled v-model.trim="signupForm.title" type="text" placeholder="Profession" id="title"></v-text-field>
          <v-text-field filled v-model.trim="signupForm.email" type="text" placeholder="Email*" id="email2"></v-text-field>
          <v-text-field filled v-model.trim="signupForm.password" type="password" placeholder="Password*" hint="min 6 characters" id="password2" autocomplete="new-password" :rules="passwordRules">
            <v-tooltip slot="append" right color="#212121" v-if="signupForm.password.length >= 6">
              <template v-slot:activator="{ on, attrs }">
                <v-icon  v-bind="attrs" v-on="on"
                  :class="signupForm.password.length >= 6  && !doubleCheckPw.length
                    ? 'grey--text'
                    : doubleCheck
                    ? signupForm.password.length && signupForm.password.length && signupForm.password === doubleCheckPw
                      ? 'green--text'
                        : 'red--text'
                          : 'green--text'"
                  @click="doubleCheck = !doubleCheck"
                >
                  mdi-check-all
                </v-icon>
              </template>
              <div>
                Let me double check this password..
              </div>
            </v-tooltip>
          </v-text-field>
          <v-text-field v-if="doubleCheck"
            :rules="passwordRepeatRules"
            filled
            v-model.trim="doubleCheckPw"
            type="password"
            placeholder="Repeat password*"
            hint="Same as above"
            id="confirm-password-text-field"
            autocomplete="new-password"
          ></v-text-field>
            <!-- <v-checkbox v-model="consent.privacy" :label="`Checkbox 1: ${consent.privacy.toString()}`"></v-checkbox> -->

            <v-checkbox dense hide-details class="ma-0" v-model="checkbox.privacy" required :rules="[v => !!v || 'You must agree to continue!']">
              <template v-slot:label>
                  I agree to the <router-link class="ml-1" to="/privacy" @click.stop>Privacy Agreement</router-link>
              </template>
            </v-checkbox>
            
            <v-checkbox dense hide-details class="ma-0" v-model="checkbox.terms" required :rules="[v => !!v || 'You must agree to continue!']">
              <template v-slot:label>
                  I agree to the <router-link class="ml-1" to="/terms" @click.stop>Terms & conditions</router-link>
              </template>
            </v-checkbox>

          <v-card-actions class="px-0 mt-4">
            <v-btn to="/login">Back</v-btn>
            <v-spacer></v-spacer>
            <!-- <v-btn type="submit" :disabled="!(checkbox.privacy && checkbox.terms && signupForm.email.length && signupForm.name.length && signupForm.password.length >= 6) && (doubleCheck && doubleCheckPw.length && doubleCheckPw != signupForm.password)" color="primary" @click="signup()">Sign Up</v-btn> -->
            <v-btn type="submit" :disabled="!validForm" color="primary" @click="signup()">Sign Up</v-btn>
          </v-card-actions>
      </v-form>
    </v-card>
</template>

<script>
  export default {
    name: 'SignUp',
    
    data () {
      return {
        validForm: true,
        signupForm: {
          name: '',
          title: '',
          email: '',
          password: '',
          privacy: null,
          terms: null,
        },
        doubleCheck: false,
        doubleCheckPw: '',
        checkbox: {
          privacy: false,
          terms: false,
        },
        veryBadPasswords: [
          "123456", "password", "12345678", "qwerty", "12345", "123456789", "letmein", "1234567", "football",
          "iloveyou", "admin", "welcome", "monkey", "login", "abc123", "starwars", "123123", "dragon", "passw0rd",
          "master's degree", "hello", "freedom", "whatever", "qazwsx", "trustno1", "654321", "jordan23", "password1",
          "1234", "robert", "matthew", "jordan", "asshole", "daniel", "andrew", "lakers", "andrea", "buster",
          "joshwa", "1qaz2wsx", "12341234", "ferrari", "cheese", "computer", "corvette", "blahblah", "george",
          "mercedes", "121212", "maverick", "fuckyou", "nicole", "hunter", "sunshine", "tigger", "1989", "merlin",
          "ranger", "solo", "banana", "chelsea", "summer", "1990", "1991", "phoenix", "amanda", "cookie", "ashley",
          "bandit", "killer", "meandyou", "pepper", "jessica", "zaq1zaq1", "jennifer", "test", "hockey", "dallas",
          "password", "fuckyouasshole", "admin123", "pussy", "pass", "asdf", "william", "soccer", "london", "1q2w3e",
          "1992", "biteme", "maggie", "querty", "rangers", "charlie", "martin", "ginger", "yankees", "thunder",
          "Michelle", "aaaaaa"],
        passwordRules: [
          v => v !== '123456' || `This cannot be your password. Haven't you seen Space Balls? We cannot guarantee any security that way - its the number one of most used passwords of all time.`,
          v => v.toLowerCase() !== 'password' || `This cannot be your password. We cannot guarantee any security that way - its the number two of most used passwords.`,
          v => !this.veryBadPasswords.includes(v.toLowerCase()) || `This has place ${this.veryBadPasswords.indexOf(v)+1} of the 100 most used passwords ever. Please choose something safe.`,
          v => v.length >= 6 || 'Password must be longer than 6 characters.',
          v => !/^(.)\1*$/.test(v) || 'Password cannot be only one repeated character.',
        ],
        passwordRepeatRules: [v => v === this.signupForm.password || 'Passwords do not match'],
      }
    },
    created() {
      this.signupForm.email = this.$route.query.email;
    },

    watch: {
      checkbox: {
        handler() {
          this.signupForm.privacy = this.checkbox.privacy ? this.signupForm.privacy ? this.signupForm.privacy : new Date() : null;
          this.signupForm.terms = this.checkbox.terms ? this.signupForm.terms ? this.signupForm.terms : new Date() : null;
        },
        deep: true
      }
    },

    methods: {
      signup() {
        if(!this.validForm) return
        //console.log(this.signupForm);
        this.$store.dispatch('signup', this.signupForm).then(() => {
          console.log('Successful signup.')
        }).catch(error => {
          console.log(error);
          console.error(error.message);
          this.$toasted.global.error({msg:error.message});
        });
      }
    },

  }
</script>

