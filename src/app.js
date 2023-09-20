let express = require("express");
let app = express();
let mongoose = require('mongoose');
let user = require('./models/user');

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

    let newUser = new User({ name, email, password });
    await newUser.save();
    res.json({ email });
  } catch (error) {
    res.sendStatus(500);
  }
});

module.exports = app;