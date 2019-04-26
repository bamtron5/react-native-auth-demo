I ran this on node v10.15.0 with local MongoDB.  I purposely left .env in here for ease of use.  Do not do this in real project.
User and password should be populated alreaady as this is just a login form ATM.
User: b@b.com
Password: password

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

You should be taken to page that displays your email and says you are logged in.  This a session cookie from express.

GLHF :)