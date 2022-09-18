# szeno&middot;DB

### Setup, dev & build
```
npm install      # Project setup
npm run serve    # Compiles & hot-reloads for development
npm run build    # Compiles & minifies for production
```

# What

This is a tool for the lovely people who work in the art department of switzerland.

szeno&middot;DB is a searchable collection of links of connections, materials, services and problem solvers.

It is geographically targeted to switzerland, as it is not intended to hold tens of thousands of entries or users, nor does it have smart ways to distinguish local and global content. So for now, its only practical for swiss based artisans.


### Auth keys
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
        measurementId: '...'
    }
}
export { authKeys }
```
