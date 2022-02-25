const controller = require("../controllers/sauces.controller");
const auth = require("../middlewares/authJwt");
const multer = require("../config/multer.config");
module.exports = function (app) {
  app.post("/api/sauces", auth.verifyToken, multer, controller.createSauces);

  app.get("/api/sauces", auth.verifyToken, controller.getAllSauces);

  app.get("/api/sauces/:id", auth.verifyToken, controller.getOneSauce);

  app.put(
    "/api/sauces/:id",
    auth.verifyToken,
    multer,
    controller.updateOneSauce
  );

  app.delete("/api/sauces/:id", auth.verifyToken, controller.deleteOneSauce);

  app.post("/api/sauces/:id/like", auth.verifyToken, controller.getLikeDislike);
};
