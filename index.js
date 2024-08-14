import ProductController from "./src/controllers/product.controller.js";
import UserController from "./src/controllers/user.controller.js";
import validationMiddleware from "./src/middleware/validation.middleware.js";
import path from "path";
import express from "express";
import ejsLayouts from "express-ejs-layouts";
import { uploadFile } from "./src/middleware/file-upload-middleware.js";
import session from "express-session";
import { auth } from "./src/middleware/auth-meddaleware.js";
import cookieParser from "cookie-parser";
// import setLastVisit from "./src/middleware/lastVisit-middleware.js";
import { setLastVisit } from "./src/middleware/lastVisit-middleware.js";
const app = express();

//setting up template engine
app.set("view engine", "ejs");
app.set("views", path.join(path.resolve(), "src", "views"));
app.use(express.urlencoded({ extended: true })); // userd to parse the form data
// app.use(express.static("src/views"));
app.use(express.static("public"));

app.use(ejsLayouts);
//for cookies
app.use(cookieParser());
app.use(setLastVisit);
app.use(
  session({
    secret: "SecretKey",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

const productController = new ProductController();
const userController = new UserController();
app.get("/register", userController.getRegister);
app.post("/register", userController.postRegister);
app.get("/login", userController.getLogin);
app.get("/logout", userController.logOut);
app.post("/login", userController.postLogin);
app.get("/", auth, productController.getProducts);
app.get("/new", auth, productController.getAddForm);
app.get("/product-update/:id", auth, productController.getUpdateProduct);
app.post(
  "/",
  auth,
  uploadFile.single("imageUrl"), // for multer use before validation middleware
  validationMiddleware,
  productController.postAddNewProduct
);
app.post("/product-update", auth, productController.postUpdateProduct);
app.post("/delete-product/:id", auth, productController.deleteProduct);

app.listen(3100, function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log("Successfully running on port 3100");
  }
});
