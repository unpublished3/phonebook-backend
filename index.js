const express = require("express");
const uuid = require("uuid");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

const Person = require("./models/persons");

const app = express();
const logger = morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, "content-length"),
    "-",
    tokens["response-time"](req, res),
    "ms",
    tokens.method(req, res) === "POST" ? JSON.stringify(req.body) : "",
  ].join(" ");
});

const errorHandler = (err, req, res, next) => {
  console.log(err.mesage);

  if (err.name == "CastError") {
    return res.status(404).send({ error: "Malformatted Id" });
  }

  next(err);
};

const numberExists = (number) => {};

app.use(express.static("dist"));
app.use(cors());
app.use(express.json());
app.use(logger);

app.get("/info", (req, res, next) => {
  Person.countDocuments()
    .then((count) => {
      let info = `<p>Phonebook has info for ${count} people</p>`;
      let date = `${new Date()}`;
      res.send(info + date);
    })
    .catch((err) => next(err));
});

app.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) res.json(person);
      else res.status(404).end();
    })
    .catch((err) => next(err));
});

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then((result) => res.status(204).end())
    .catch((err) => next(err));
});

app.post("/api/persons", (req, res) => {
  let person = req.body;
  console.log(person);

  if (!person["name"]) res.status(400).json({ error: "Name Missing" });
  else if (!person["number"]) res.status(400).json({ error: "Number Missing" });
  else {
    person = new Person({ ...person });
    person.save().then((savedPerson) => {
      res.json(savedPerson);
    });
  }
});

app.put("/api/persons/:id", (req, res, next) => {
  let person = req.body;
  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then((updatedPerson) => res.json(updatedPerson))
    .catch((err) => next(err));
});

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT);
