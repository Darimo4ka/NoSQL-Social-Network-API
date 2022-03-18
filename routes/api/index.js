const router = require("express").Router();
const userRoutes = require("./user");
// folder must be same name as api name of the file
const thoughtRoutes = require("./thoughts");

router.use("/user", userRoutes);
// you can call it what ever you want
router.use("/thought", thoughtRoutes);

module.exports = router;
