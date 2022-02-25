const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

var corsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");

const url = require("url");

db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connexion a la base de donnée a réussie .");
  })
  .catch((err) => {
    console.error("La connexion a la base de donnée a échouée ", err);
    process.exit();
  });

// simple route get
app.get("/", (req, res) => {
  res.json({ message: "Bienvenue dans l'api backend du site piiquante" });
});

//static Files
app.use(express.static("public"));
app.use("/images", express.static("images"));

// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/sauces.routes")(app);

app.use("/images", express.static(path.join(__dirname, "images")));

// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Le serveur est démarrer sur le port ${PORT}.`);
});
