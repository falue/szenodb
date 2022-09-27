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
      <v-card-title class="justify-center">Terms and Conditions</v-card-title>

      <v-card-text v-if="settings.consent && settings.consent.terms" class="white--text italics text-center">
        Stand: {{$helpers.fbTimeToString(settings.consent.terms, "DD.MM.YYYY - HH:mm")}}
      </v-card-text>

      <v-card-actions class="pl-0">
        <v-spacer></v-spacer>
        <v-spacer></v-spacer>
        <v-icon small color="pink">mdi-heart</v-icon>
        <v-spacer></v-spacer>
        <v-icon small color="pink">mdi-hammer-wrench</v-icon>
        <v-spacer></v-spacer>
        <v-icon small color="pink">mdi-format-paint</v-icon>
        <v-spacer></v-spacer>
        <v-icon small color="pink">mdi-sofa-single</v-icon>
        <v-spacer></v-spacer>
        <v-icon small color="pink">mdi-truck-cargo-container</v-icon>
        <v-spacer></v-spacer>
        <v-icon small color="pink">mdi-desktop-classic</v-icon>
        <v-spacer></v-spacer>
        <v-icon small color="pink">mdi-head-flash</v-icon>
        <v-spacer></v-spacer>
        <v-spacer></v-spacer>
      </v-card-actions>


      <v-card-text class="white--text">
        <p>These terms and conditions outline the rules and regulations for the use of Fabian Lüscher Filmkulissen's Website, located at szenodb.ch.</p>

        <p>By accessing this website we assume you accept these terms and conditions. Do not continue to use szenoDB if you do not agree to take all of the terms and conditions stated on this page.</p>

        <p>The following terminology applies to these Terms and Conditions, Privacy Statement and Disclaimer Notice and all Agreements: "Client", "You" and "Your" refers to you, the person log on this website and compliant to the Company’s terms and conditions. "The Company", "Ourselves", "We", "Our" and "Us", refers to our Company. "Party", "Parties", or "Us", refers to both the Client and ourselves. All terms refer to the offer, acceptance and consideration of payment necessary to undertake the process of our assistance to the Client in the most appropriate manner for the express purpose of meeting the Client’s needs in respect of provision of the Company’s stated services, in accordance with and subject to, prevailing law of Netherlands. Any use of the above terminology or other words in the singular, plural, capitalization and/or he/she or they, are taken as interchangeable and therefore as referring to same.</p>

        <h3>Cookies</h3>

        <p>We employ the use of cookies. By accessing szenoDB, you agreed to use cookies in agreement with the Fabian Lüscher Filmkulissen's Privacy Policy. </p>

        <p>Most interactive websites use cookies to let us retrieve the user’s details for each visit. Cookies are used by our website to enable the functionality of certain areas to make it easier for people visiting our website. Some of our affiliate/advertising partners may also use cookies.</p>

        <h3>License GNU GPLv3</h3>

        <p>
          This project is open-source under <a href="https://github.com/falue/szenodb/blob/main/COPYING" target="_blank">GNU GPLv3</a>.
        </p>

        <strong>Permissions</strong>
        <ul class="permissions">
          <li>Commercial use</li>
          <li>Distribution</li>
          <li>Modification</li>
          <li>Patent use</li>
          <li>Private use</li>
        </ul>

        <strong>Conditions</strong>
        <ul class="conditions">
            <li>Disclose source</li>
            <li>License and copyright notice</li>
            <li>Same license</li>
            <li>State changes</li>
        </ul>

        <strong>Limitations</strong>
        <ul class="limitations">
          <li>Liability </li>
          <li>Warranty</li>
        </ul>
          

        <p>This Agreement shall begin on the date hereof.</p>

        <p>Parts of this website offer an opportunity for users to post and exchange opinions and information in certain areas of the website. Fabian Lüscher Filmkulissen does not filter, edit, publish or review Comments prior to their presence on the website. Comments do not reflect the views and opinions of Fabian Lüscher Filmkulissen,its agents and/or affiliates. Comments reflect the views and opinions of the person who post their views and opinions. To the extent permitted by applicable laws, Fabian Lüscher Filmkulissen shall not be liable for the Comments or for any liability, damages or expenses caused and/or suffered as a result of any use of and/or posting of and/or appearance of the Comments on this website.</p>

        <p>Fabian Lüscher Filmkulissen reserves the right to monitor all Comments and to remove any Comments which can be considered inappropriate, offensive or causes breach of these Terms and Conditions.</p>

        <p>You warrant and represent that:</p>

        <ul>
            <li>You are entitled to post the Comments on our website and have all necessary licenses and consents to do so;</li>
            <li>The Comments do not invade any intellectual property right, including without limitation copyright, patent or trademark of any third party;</li>
            <li>The Comments do not contain any defamatory, libelous, offensive, indecent or otherwise unlawful material which is an invasion of privacy</li>
            <li>The Comments will not be used to solicit or promote business or custom or present commercial activities or unlawful activity.</li>
        </ul>

        <p>You hereby grant Fabian Lüscher Filmkulissen a non-exclusive license to use, reproduce, edit and authorize others to use, reproduce and edit any of your Comments in any and all forms, formats or media.</p>

        <h3>Hyperlinking to our Content</h3>

        <p>The following organizations may link to our Website without prior written approval:</p>

        <ul>
            <li>Government agencies;</li>
            <li>Search engines;</li>
            <li>News organizations;</li>
            <li>Online directory distributors may link to our Website in the same manner as they hyperlink to the Websites of other listed businesses; and</li>
            <li>System wide Accredited Businesses except soliciting non-profit organizations, charity shopping malls, and charity fundraising groups which may not hyperlink to our Web site.</li>
        </ul>

        <p>These organizations may link to our home page, to publications or to other Website information so long as the link: (a) is not in any way deceptive; (b) does not falsely imply sponsorship, endorsement or approval of the linking party and its products and/or services; and (c) fits within the context of the linking party’s site.</p>

        <p>We may consider and approve other link requests from the following types of organizations:</p>

        <ul>
            <li>commonly-known consumer and/or business information sources;</li>
            <li>dot.com community sites;</li>
            <li>associations or other groups representing charities;</li>
            <li>online directory distributors;</li>
            <li>internet portals;</li>
            <li>accounting, law and consulting firms; and</li>
            <li>educational institutions and trade associations.</li>
        </ul>

        <p>We will approve link requests from these organizations if we decide that: (a) the link would not make us look unfavorably to ourselves or to our accredited businesses; (b) the organization does not have any negative records with us; (c) the benefit to us from the visibility of the hyperlink compensates the absence of Fabian Lüscher Filmkulissen; and (d) the link is in the context of general resource information.</p>

        <p>These organizations may link to our home page so long as the link: (a) is not in any way deceptive; (b) does not falsely imply sponsorship, endorsement or approval of the linking party and its products or services; and (c) fits within the context of the linking party’s site.</p>

        <p>If you are one of the organizations listed in paragraph 2 above and are interested in linking to our website, you must inform us by sending an e-mail to Fabian Lüscher Filmkulissen. Please include your name, your organization name, contact information as well as the URL of your site, a list of any URLs from which you intend to link to our Website, and a list of the URLs on our site to which you would like to link. Wait 2-3 weeks for a response.</p>

        <p>Approved organizations may hyperlink to our Website as follows:</p>

        <ul>
            <li>By use of our corporate name; or</li>
            <li>By use of the uniform resource locator being linked to; or</li>
            <li>By use of any other description of our Website being linked to that makes sense within the context and format of content on the linking party’s site.</li>
        </ul>

        <p>No use of Fabian Lüscher Filmkulissen's logo or other artwork will be allowed for linking absent a trademark license agreement.</p>

        <h3>iFrames</h3>

        <p>Without prior approval and written permission, you may not create frames around our Webpages that alter in any way the visual presentation or appearance of our Website.</p>

        <h3>Content Liability</h3>

        <p>We shall not be hold responsible for any content that appears on your Website. You agree to protect and defend us against all claims that is rising on your Website. No link(s) should appear on any Website that may be interpreted as libelous, obscene or criminal, or which infringes, otherwise violates, or advocates the infringement or other violation of, any third party rights.</p>

        <h3>Your Privacy</h3>

        <p>Please read <router-link to="/privacy">Privacy Policy</router-link></p>

        <h3>Reservation of Rights</h3>

        <p>We reserve the right to request that you remove all links or any particular link to our Website. You approve to immediately remove all links to our Website upon request. We also reserve the right to amen these terms and conditions and it’s linking policy at any time. By continuously linking to our Website, you agree to be bound to and follow these linking terms and conditions.</p>

        <h3>Removal of links from our website</h3>

        <p>If you find any link on our Website that is offensive for any reason, you are free to contact and inform us any moment. We will consider requests to remove links but we are not obligated to or so or to respond to you directly.</p>

        <p>We do not ensure that the information on this website is correct, we do not warrant its completeness or accuracy; nor do we promise to ensure that the website remains available or that the material on the website is kept up to date.</p>

        <h3>Disclaimer</h3>

        <p>To the maximum extent permitted by applicable law, we exclude all representations, warranties and conditions relating to our website and the use of this website. Nothing in this disclaimer will:</p>

        <ul>
          <li>limit or exclude our or your liability for death or personal injury;</li>
          <li>limit or exclude our or your liability for fraud or fraudulent misrepresentation;</li>
          <li>limit any of our or your liabilities in any way that is not permitted under applicable law; or</li>
          <li>exclude any of our or your liabilities that may not be excluded under applicable law.</li>
        </ul>

        <p>The limitations and prohibitions of liability set in this Section and elsewhere in this disclaimer: (a) are subject to the preceding paragraph; and (b) govern all liabilities arising under the disclaimer, including liabilities arising in contract, in tort and for breach of statutory duty.</p>

        <p>As long as the website and the information and services on the website are provided free of charge, we will not be liable for any loss or damage of any nature.</p>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
  export default {
    name: 'Terms',
    props: {
      settings: Object,
    },
    data () {
      return {
      }
    },
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
  h3 {
    font-weight: normal;
    padding: 0;
    margin: 2.75em 0 0.5em 0;
    scroll-margin-top: 100px;
    transform: translateX(-.95em);
  }
  h3:before {
    content: "# ";
    color: grey;
  }
  /* h3 {
    font-weight: normal;
    padding: 0;
    margin: 1em 0 0.125em 0;
  } */
  ul {
    padding-bottom: 1em;
    list-style-type: '- ';
  }
  ul.permissions {
    list-style-type: '🟢  ';
  }
  ul.conditions {
    list-style-type: '🔵  ';
  }
  ul.limitations {
    list-style-type: '🔴  ';
  }
</style>