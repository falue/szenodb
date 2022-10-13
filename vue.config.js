// Get name of project folder for deploay to subfolder on FTP server
const path = require("path");
console.log('!!! If served in root folder of server, disable row 11-13 in vue.config.js');
console.log('!!! If served sub folder, name which the subfolder on the server should have: "' + path.basename(path.resolve()) + '" !!! Change this in vue.config.js');

module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  devServer: {
    // https: true,
    // host: 'localhost',  // those make hot reload possible on desktop, but fail on mobile to display at all
    // port: 8080  // those make hot reload possible on desktop, but fail on mobile to display at all
  }
  // Remove this option if deployed & served directly on the root folder on my server:
  /* publicPath: process.env.NODE_ENV === 'production'
    ? "/" + path.basename(path.resolve())
    : '' */
}