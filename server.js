// create var for req file and packages.
const express = require("express");
const db = require ('./config/connection');
// const routes = require('./routes');


// port var and app var
const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// turn on routes
app.use(require('./routes'));

db.once("open", () => {
  app.listen(PORT, () => {
    console.log(`API server for ${activity} running on port ${PORT}!`);
  });
});