import Vue from 'vue';
/* import md5 from 'md5'; */

export default {
  toUrlText: function (text) {
    return encodeURI(text);
  },

  //$moment(playingClip.date).format("dd, MMMM Do, YYYY - HH:mm:ss")
  fbTimeToString: function (fbtimestamp, format) {
    try {
      fbtimestamp = Vue.prototype.$moment(fbtimestamp.toDate()).format(format);
    } catch (err) {
      console.log("fbTimeToString function failed, maybe a datatype map instead of a timestamp?")
      console.log(err)
      try {
        fbtimestamp = Vue.prototype.$moment.unix(fbtimestamp.seconds).format(format) + ' [invalid format]';
      } catch (err) {
        console.log("fbTimeToString failed to get seconds, return the string as is..")
        console.log(err)
        fbtimestamp = fbtimestamp + ' [invalid format]';
      }
    }
    return fbtimestamp;
  },

  fbTimeToDateObject: function (fbtimestamp) {
    return fbtimestamp.toDate();
  },

  dateObjectToFbTime: function (jsDate) {
    console.log('dateObjectToFbTime oes NOT work as of now. sure it looks the same, but is not recognizes in the db as a correct timestamp. fml')
    return {'seconds': Math.floor(jsDate.getTime() / 1000), 'nanoseconds':0}
  },

  timeRelativeToNow: function (timestamp, referenceDay=null) {
    let formats = {
      //sameDay: '[Today at ] HH:mm',
      sameDay: function () { return '['+this.fromNow()+']' },
      nextDay: '[Tomorrow ] HH:mm',
      nextWeek: '[Next ] dddd HH:mm',
      lastDay: '[Yesterday ] HH:mm',
      lastWeek: '[Last ] dddd HH:mm',
      sameElse: 'dd, MMMM Do, YYYY - HH:mm'
    };
    return Vue.prototype.$moment(timestamp).calendar(referenceDay, formats);
  },

  copyClipBoard(text, title='Text') {
    if(typeof (text) === 'object') text = text.join("\n");
    Vue.prototype.$copyText(text).then(function () {
      Vue.prototype.$toasted.global.success({msg:`${title} was copied to your clipboard`});
      // Vue.prototype.$flashStorage.flash(`${title} was copied to your clipboard`, 'success', {timeout: 1000})
    }, function (e) {
      console.log(e);
    });
  },

  /* .calendar(null, {
    sameDay: '[Today]',
    nextDay: '[Tomorrow]',
    nextWeek: 'dddd',
    lastDay: '[Yesterday]',
    lastWeek: '[Last] dddd',
    sameElse: 'DD/MM/YYYY'
}); */

  sleep: async function (ms) {
    // use like this: await this.sleep(delay);
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  /* NOT USED: */

  createCookie(name, value, days) {
    let expires = "";
    if (days) {
      let date;
      date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = `; expires=${date.toGMTString()}`;
    }
    value = typeof value === 'object' ? JSON.stringify(value) : value;
    document.cookie = `${name} = ${value}${expires}; path=/`;
  },

  readCookie(name) {
    let searchName = `${name}=`;
    let cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      let data = cookies[i];
      while (data.charAt(0) === ' ') data = data.substring(1, data.length);
      if (data.indexOf(searchName) === 0) {
        let value = data.substring(searchName.length, data.length);
        if(value[0] === '{') value = JSON.parse(value);
        return value;
      }
    }
    return null;
  },

  removeCookie(name) {
    this.createCookie(name, '', -1);
  },

  createUid() {
    let S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
  },

  findKey(haystack, keyName, needle, returnKey="id") {
    let results=[];
    for(let i = 0; i < haystack.length; i++){
      if(haystack[i][keyName] === needle){
          if(returnKey === 'boolean') {
            return true;
          } else if(returnKey === 'list') {
            results.push(i);
          } else if(returnKey === 'index') {
            return i;
          } else if(returnKey === 'object') {
            return haystack[i];
          } else {
            return haystack[i][returnKey];
          }
      }
    }
    return returnKey === 'list'
      ? results
      : returnKey === 'object'
        ? []
        : false;
  },

  getToday() {
    const toTwoDigits = num => num < 10 ? '0' + num : num;
    let today = new Date();
    let year = today.getFullYear();
    let month = toTwoDigits(today.getMonth() + 1);
    let day = toTwoDigits(today.getDate());
    let hours = toTwoDigits(today.getHours());
    let minutes = toTwoDigits(today.getMinutes());
    let seconds = toTwoDigits(today.getSeconds());
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  },

  eightDateToDate(date, string) {
    date = date ? date : '00000000';
    string = string ? string : 'ddd, MMM Do, YYYY';
    let year = date.substr(0, 4);
    let month = date.substr(4, 2);
    let day = date.substr(6, 2);
    let newDate = `${year}-${month}-${day}T12:00:00`;
    if(date && string === 'ISO8601') {
      date = Vue.prototype.$moment(newDate).toISOString();
    } else if (date !== '00000000') {
      date = Vue.prototype.$moment(newDate).format(string);
    }

    return date !== '00000000' ? date : '0000-00-00'
  },

  stripHtml(text) {
    return text.trim().replace(/<(?:.|\n)*?>/gm, '').replace(/['\\"]+/g, '');
  },

  checkEmail(email) {
    // Almost perfect: '..' is 'true'. Also, '+' gives web2py the weezies. remove '\+' to probably match web2py regex
    return  /^([a-zA-Z0-9_.\-+])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/i.test(email);
  },

  getFirstWord(string) {
    return string ? string.split(/[^A-Za-z]/)[0] : '';
  },

  parseEmail(data) {
    if(data.indexOf('<') >= 0 && data.indexOf('>') >= 0) {
      let name = data.split("<")[0].trim().split(" ");
      let lastName = name[name.length - 1];  // last word is lastName
      name.pop();
      let firstName = name.join(' ');
      let email = data.split("<")[1].split(">")[0];
      if(this.checkEmail(email)) {
        return {'firstName': firstName, 'lastName': lastName, 'email': email};
      } else {
        return false;
      }
    } else {
      return false;
    }
  },

  truncate(string, length, dots='...') {
    if(string.length <= length) return string;
    length -= dots.length;
    return  string.substring(0,length/2) + dots + string.substring(string.length-length/2, string.length)
  },

  ellipsis(string, length, dots='...', fromEnd=false) {
    if(string.length <= length) return string;
    if(fromEnd) return dots + string.substring(string.length-length+dots.length)
    length -= dots.length;
    return  string.substring(0,length) + dots
  },

  capitalize(string) {
    if(string && string.length) {
      return string[0].toUpperCase() + string.slice(1);
    } else {
      return string
    }
  },

  async getRandomString(numberOfStrings=1, stringLength='random') {
    if(stringLength === 'random') {
      stringLength = Math.floor(Math.random() * 6) + 12;
    }
    let bodyData = {
      "jsonrpc": "2.0",
      "method": "generateStrings",
      "params": {
        "apiKey": "2b11bfbc-1fe0-47ac-aa08-48593be3f75b",
        "n": numberOfStrings,
        "length": stringLength,
        "characters": "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789-_",
        "replacement": true
      },
      "id": 42
    };

    let response;

    if (!(response = await this.$helpers.restApi('plainUrl-post', `https://api.random.org/json-rpc/1/invoke`, bodyData)).data.error) {
        console.log(response.data.result['random'].data);
        if(numberOfStrings === 1) {
          this.randomKey = response.data.result['random'].data[0];
        } else {
          this.randomKey = response.data.result['random'].data;
        }
        return true;
      } else {
        console.log(response);
        return false;
      }
  },

  difference(a1 = [], a2 = []) {
    let a2Set = new Set(a2);
    return a1.filter(function (x) {
      return !a2Set.has(x);
    });
  },

  symmetricDifference(a1 = [], a2 = []) {
    return this.difference(a1, a2).concat(this.difference(a2, a1));
  },

  isUrl(src) {
    // return /(http(s?):)([/|.|\w|\s|-])*\./.test(src);
    return /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/.test(src);
  },

  retrieveDomain(url) {
    try {
      return new URL(url).hostname.replace('www.','');
    } catch(err) {
      return url;
    }
  },

  /* md5(text) {
    return md5(text);
  }, */

  // Check for EXIF image orientation
  // https://jsfiddle.net/wunderbart/dtwkfjpg/
  async getImageOrientation(file) {
    return new Promise((resolve, reject) => {
      let img = new FileReader();

      img.onload = function (event) {
        let view = new DataView(event.target.result);

        if (view.getUint16(0, false) !== 0xFFD8) {
          resolve(-2);
        }

        let length = view.byteLength;
        let offset = 2;

        while (offset < length) {
          let marker = view.getUint16(offset, false);
          offset += 2;

          if (marker === 0xFFE1) {
            if (view.getUint32(offset += 2, false) !== 0x45786966) {
              resolve(-1);
            }
            let little = view.getUint16(offset += 6, false) === 0x4949;
            offset += view.getUint32(offset + 4, little);
            let tags = view.getUint16(offset, little);
            offset += 2;

            for (let i = 0; i < tags; i++)
              if (view.getUint16(offset + (i * 12), little) === 0x0112) {
                resolve(view.getUint16(offset + (i * 12) + 8, little));
              }
          } else if ((marker & 0xFF00) !== 0xFF00) break;
          else offset += view.getUint16(offset, false);
        }
        resolve(-1);
      };
      img.onerror = reject;
      img.readAsArrayBuffer(file.slice(0, 64 * 1024));
    });
  },


  // Takes a data URI and returns the Data URI corresponding to the resized image at the wanted size.
  async resizeBase64Img(base64, fileType, maxWidth, maxHeight) {
    return new Promise((resolve, reject) => {
      // We create an image to receive the Data URI
      let img = document.createElement('img');
      img.src = `data:${fileType};base64,${base64}`;

      img.onload = function () {
        // We create a canvas and get its context.
        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');

        let proportion = 1 / img.naturalWidth * img.naturalHeight;
        let resizedWidth;
        let resizedheight;

        // Fit within boundaries
        if (img.naturalWidth >= img.naturalHeight) {
          resizedWidth = maxWidth;
          resizedheight = maxHeight * proportion;
        } else {
          resizedWidth = maxWidth / proportion;
          resizedheight = maxHeight;
        }
        canvas.width = resizedWidth;
        canvas.height = resizedheight;

        // We resize the image with the canvas method drawImage();
        ctx.drawImage(this, 0, 0, resizedWidth, resizedheight);

        let dataURI = canvas.toDataURL();
        resolve(dataURI.split(',')[1]);
      };
      img.onerror = reject;
    });
  },


  // Rotate base64 image string
  async rotateBase64Image(base64, fileType, degrees) {
    return new Promise((resolve, reject) => {
      // We create an image to receive the Data URI
      let img = new Image();
      img.src = `data:${fileType};base64,${base64}`;

      img.onload = function () {
        // We create a canvas and get its context.
        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');

        if (degrees === 90 || degrees === 270) {
          canvas.height = img.width;
          canvas.width = img.height;
        } else {
          canvas.height = img.height;
          canvas.width = img.width;
        }

        // rotate and draw source image into the off-screen canvas:
        if (degrees === 90) {
          ctx.rotate(90 * Math.PI / 180);
          ctx.translate(0, -canvas.width);
        } else if (degrees === 270) {
          ctx.rotate(-90 * Math.PI / 180);
          ctx.translate(-canvas.height, 0);
        } else if (degrees === 180) {
          ctx.rotate(180 * Math.PI / 180);
          ctx.translate(-canvas.width, -canvas.height);
        }
        ctx.drawImage(img, 0, 0);

        let dataURI = canvas.toDataURL();
        resolve(dataURI.split(',')[1]);
      };
      img.onerror = reject;
    });
  },

  // calculate timecode from miliseconds
  miliToTimecode(seconds, TimeFormat) {
    if(typeof seconds !== "number") return seconds;
    //alert(milliseconds);
    var h = Math.floor(seconds / 3600);
    seconds = seconds - h * 3600;
    var m = Math.floor(seconds / 60);
    seconds = seconds - m * 60;
    var s = Math.floor(seconds);
    seconds = seconds - s;
    let f;
    if (TimeFormat === 'PAL') {
      f = Math.floor((seconds * 1000) / 40);
    } else if (TimeFormat === 'NTSC') {
      f = Math.floor((seconds * 1000) / (100 / 3));
    } else if (TimeFormat === 'PALp') {
      f = Math.floor((seconds * 1000) / 20);
    } else if (TimeFormat === 'STANDARD') {
      f = Math.floor(seconds * 1000);
    } else if (typeof (TimeFormat) === 'number') {
      f = Math.floor((seconds * 1000) / (1000 / TimeFormat));
    }
    // Check if we need to show hours
    h = (h < 10) ? ("0" + h) + ":" : h + ":";

    // If hours are showing, we may need to add a leading zero.
    // Always show at least one digit of minutes.
    m = (((h) && m < 10) ? "0" + m : m) + ":";

    // Check if leading zero is need for seconds
    s = ((s < 10) ? "0" + s : s) + ":";

    f = (f < 10) ? "0" + f : f;

    if (TimeFormat === 'STANDARD')
      f = (f < 100) ? "0" + f : f;
    return h + m + s + f;
  },

  timeToSeconds(timecode) {
    let seconds;
    let frames;
    let r = timecode.split(":");
    frames = r.pop();

    // split it at the colons
    if (r.length === 1) {
        seconds = r[0];
    } else if (r.length === 2) {
        seconds = r[0] * 60 + r[1] * 1;
    } else if (r.length === 3) {
        seconds = r[0] * 3600 + r[1] * 60 + r[2] * 1;
    } else if (r.length === 4) {
        seconds = r[0] * 3600 + r[1] * 60 + r[2] * 1;
        frames[1] = r[3];
    } else {
        seconds = 0;
    }
    return parseFloat(seconds +"."+ frames[1]);
  },

  sumOfArrayValues(arr){
    return Object.values(arr).reduce(function(a,b){
      return a + b
    }, 0);
  },

  range(start, end) {
    if(start > end) {
      let intermediate = start;
      start = end
      end = intermediate
    }
    return Array(end - start + 1).fill().map((_, idx) => start + idx)
  },

  getPercentage(value, total) {
    let percentage = total ? value * 100 / total : 0;
    return +percentage.toFixed(1);
  },

  humanSize(bytes) {
    if(bytes) {
      let suffixes = ['B', 'kB', 'MB', 'GB', 'TB', 'PB'];
      let i = 0;

      while (bytes >= 1000 && i < suffixes.length - 1){
          bytes /= 1000;
          i += 1;
      }
      return [bytes.toFixed(2), suffixes[i]]
    } else {
      return [0, 'MB'];
    }
  },
}
