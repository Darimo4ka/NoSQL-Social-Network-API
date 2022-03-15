// create var for req file and packages.
const express = require("express");
const db = require ('./config/connection');
const routes = require('./routes');


// port var and app var
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// turn on routes
app.use(routes);

db.once("open", () => {
  app.listen(PORT, () => {
    console.log(`API server for ${activity} running on port ${PORT}!`);
  });
});