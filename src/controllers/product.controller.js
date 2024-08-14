import path from "path";
import ProductModel from "../models/product.model.js";

export default class ProductController {
  getProducts(req, res) {
    let products = ProductModel.get();
    console.log(products);
    return res.render("products", {
      products: products,
      userEmail: req.session.userEmail, // passed to authetication of session
    });
    // return res.sendFile(path.join(path.resolve(),"src",'views',"products.html" ));
  }

  getAddForm(req, res) {
    return res.render("new-product", {
      errorMessage: null,
      userEmail: req.session.userEmail, // we have to send erroeMessage as null
    });
  }

  postAddNewProduct(req, res) {
    //access the data from form
    const { name, price, desc } = req.body;
    const imageUrl = "images/" + req.file.filename;

    ProductModel.add(name, desc, price, imageUrl);
    let products = ProductModel.get();
    return res.render("products", {
      products: products,
      userEmail: req.session.userEmail,
    });
  }

  getUpdateProduct(req, res, next) {
    const id = req.params.id;
    const productFound = ProductModel.getById(id);
    if (productFound) {
      res.render("update-product", {
        product: productFound,
        errorMessage: null,
        userEmail: req.session.userEmail,
      });
    } else {
      res.status(401).send("Product not found");
    }
  }

  postUpdateProduct(req, res) {
    ProductModel.update(req.body);
    let products = ProductModel.getAll();
    return res.render("products", {
      products: products,
      userEmail: req.session.userEmail,
    });
  }

  deleteProduct(req, res) {
    const id = req.params.id;
    const productFound = ProductModel.getById(id);
    if (!productFound) {
      return res.status(401).send("Product not found");
    }
    ProductModel.delete(id);
    var products = ProductModel.getAll();
    res.render("products", { products, userEmail: req.session.userEmail });
  }
}
