require('dotenv').config({path: __dirname + '/.env'})
module.exports = {
  url: process.env.DATABASE_URL
};
