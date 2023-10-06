let express = require('express');
let app = express();
let mongoose = require('mongoose');
let user = require('./models/user');
let bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

mongoose.connect("mongodb://0.0.0.0:27017/snapAPI", { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
  console.log("Conectado com o banco");
}).catch((err) => {
  console.log(err);
});

let User = mongoose.model("User", user);

app.get('/', (req, res) => {
  res.json({});
});

app.post("/user", async (req, res) => {
  let { name, email, password } = req.body;

  if (name === "" || email == "" || password == "") return res.sendStatus(400);

  try {
    let user = await User.findOne({ email });

    if (user) {
      res.statusCode = 400;
      res.json({ error: "Email já cadastrado" });
      return
    }

    let salt = await bcrypt.genSalt(10);
    let hash = await bcrypt.hash(password, salt);

    let newUser = new User({ name, email, password: hash });
    await newUser.save();
    res.json({ email });
  } catch (error) {
    res.sendStatus(500);
  }
});

app.delete("/user/:email", async (req, res) => {
  await User.deleteOne({ email: req.params.email });
  res.sendStatus(200);
});

module.exports = app;