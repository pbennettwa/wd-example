require('dotenv').config();
const DiscoveryV2 = require('ibm-watson/discovery/v2');
const { IamAuthenticator } = require('ibm-watson/auth');

const discovery = new DiscoveryV2({
  version: process.env.VERSION,
  authenticator: new IamAuthenticator({
    apikey: process.env.API_KEY,
  }),
  serviceUrl: process.env.SERVICE_URL,
});

module.exports = {
  discovery: discovery,
};
