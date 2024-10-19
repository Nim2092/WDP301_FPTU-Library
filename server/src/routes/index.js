const express = require("express");
const router = express.Router();
const AuthRouter = require("./auth.route");
const UserRouter = require("./user.route");
const BookRouter = require("./book.route");
const CatalogRouter = require("./catalog.route");
const OrderRouter = require("./order.route");
const BookSetRouter = require("./bookset.route");
const RuleRouter = require("./rule.route");
const FinesRouter = require("./fines.route");
const NewsRouter = require("./news.route");
const NotificationRouter = require("./notification.route");

router.use("/auth", AuthRouter);
router.use("/user", UserRouter);

router.use("/catalogs", CatalogRouter);
router.use("/book-sets", BookSetRouter);
router.use("/books", BookRouter);

router.use("/orders", OrderRouter);
router.use("/fines", FinesRouter);

router.use("/news", NewsRouter);
router.use("/rules", RuleRouter);

router.use("/notifications", NotificationRouter);
module.exports = router;
