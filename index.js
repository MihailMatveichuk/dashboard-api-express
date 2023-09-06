import express from "express";

const port = 8000;
const app = express();

app.all("/hello", (req, res, next) => {
  console.log("All");
  next();
});

const cb = (req, res, next) => {
  console.log("CB");
  next();
};

app
  .route("/book")
  .get(function (req, res) {
    res.send("Get a random book");
  })
  .post(function (req, res) {
    res.send("Add a book");
  })
  .put(function (req, res) {
    res.send("Update the book");
  });

app.listen(port, () => {
  console.log(`Server was launched on http://localhost:${port}`);
});
