*![SzenoDB icon](./public/icon_small.png)*

# szeno&middot;DB
This is a tool for the lovely people who work in the art department of switzerland.

szeno&middot;DB is a searchable collection of links of connections, materials, services and problem solvers.

It is geographically targeted to switzerland, as it is not intended to hold tens of thousands of entries or users, nor does it have smart ways to distinguish local and global content. So for now, its only practical for swiss based artisans.

This uses the [vue.js](https://vuejs.org/) frontend and [Google Cloud Firestore](https://cloud.google.com/firestore) as a backend. Hosting currently by [metanet.ch](metanet.ch).

Translations happen with [deepl API](https://www.deepl.com/de/docs-api).

Styling by [vuetify.js](https://vuetifyjs.com/) and with [Material Design Fonts & Icons Guidelines](https://material.io/).

# How to
## Setup, dev, build & deploy
### With `npm`
```
npm install           # Project setup
npm run serve         # Compiles & hot-reloads for development
npm run build         # Compiles & minifies for production
```

### With `deploy.sh` script
```
./deploy.sh           # git stash, npm run build & deploy to server.
./deploy.sh -i        # git stash, npm run build & deploy to server,
                      #   git commit increment marginal number
                      #   (e.g '0.2.99' => '0.2.100' ).
./deploy.sh -v 6.6.6  # git stash, npm run build & deploy to server,
                      #   git commit set version to 6.6.6.
./deploy.sh -b        # npm run build & deploy to beta.szenodb.ch (publish uncommited changes!)
```
Be sure to change the IP of your server in the `deploy.sh` script and [enable ssh](https://www.metanet.ch/support/713#10591-ssh).

## Auth keys
For obvious reasons, auth keys are removed from this repo by `.gitignore`.

The file that holds the keys is `src/auth.js` and contains the following:

```
const authKeys = {
    'deepl': {
        auth_key: '...'
    },
    'fb' : {
        apiKey: '...',
        messagingSenderId: '...',
        appId: '...',
        measurementId: '...',
        storageBucket: '...'
    }
}
export { authKeys }
```

## License
This is published under the [GNU GPLv3](COPYING) license.
