I ran this on node v10.15.0 with local MongoDB.
User and password should be populated already as this is just a login form ATM.

User: b@b.com
Password: password

User: a@a.com
Password: password

### Config
1) `touch ./server/.env`
2) add config to `.env`
```
PORT=8080
MONGO_URI=mongodb://localhost:27017/nativeReactDemo
SESSION_SECRET=secretkey
ROOT_DOMAIN=localhost
ROOT_URL=localhost:3000
JWT_SECRET=secretkey
USER_EMAIL=b@b.com
USER_PASSWORD=password
USER_ROLES=user
ADMIN_EMAIL=a@a.com
ADMIN_PASSWORD=password
ADMIN_ROLES=user.admin
```

### Install and Start API
1) `cd server`
2) `npm i`
3) `npm start`
4) `cd ..`
5) `npm i`

### Build
1) from root dir `react-native eject` 
2) from root dir `react-native upgrade`
3) from root dir `react-native link`

### Run and Test
1) `react-native run-android` <- make sure android emulator is running
2) Login with user and password
3) `react-native run-ios`
4) Login with user and password

You should be taken to a page that displays your email and says you are logged in.  This runs with a 2 day refresh token and a 15 min access token. Which is provisioned by a signed cookie served over proxy as http only and secure (https) in production.  Api's are guarded by roles determined from the req which are verified against the Users collection in middleware prior to the API Mount.

GLHF :)