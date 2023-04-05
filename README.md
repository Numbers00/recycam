# recycam
to submit for the Google Developers 2023 Solution Challenge

Running the System Locally

To run the system locally follow these steps.

Ready 2 terminals, one for the /server and one for the /RecyCam project subdirectories.

For the terminal in /server, enter:
npm i

to install all dependencies for the node.js/express server, then run:
npm run dev

to run the server in development mode, i.e., it will use the development database, or:
npm start

to run the server in production mode, i.e., it will use the production database.


For the terminal in /RecyCam, enter:
npm i --legacy-peer-deps

to install all dependencies for the React Native Expo project, ignore all warnings, and then run:
npm start

to start the metro. Have your Expo Go on your mobile ready to either scan the QR code or manually
enter the URL. If you don't have Expo Go, install it first on google play. You don't have to have an account
to scan the QR code or enter the URL.

With both the server and RecyCam app running, the app is ready for testing on your mobile.