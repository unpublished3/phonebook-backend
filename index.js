const express = require("express");
const uuid = require("uuid");
const morgan = require("morgan");

const app = express();

app.use(express.json());
app.use(morgan("tiny"));

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (req, res) =>
  res.send(
    "<h1>Phonebook</h1><a href='/api/persons'>Data</a><br /><a href='/info'>Info</a>"
  )
);

app.get("/info", (req, res) => {
  let info = `<p>Phonebook has info for ${persons.length} people</p>`;
  let date = `${new Date()}`;
  res.send(info + date);
});

app.get("/api/persons", (req, res) => res.json(persons));

app.get("/api/persons/:id", (req, res) => {
  const person = persons.find((p) => p.id === req.params.id);
  if (!person) res.status(404).end();
  else res.json(person);
});

app.delete("/api/persons/:id", (req, res) => {
  persons = persons.filter((person) => person.id !== req.params.id);
  res.send(204).end();
});

app.post("/api/persons", (req, res) => {
  let person = req.body;

  if (!person["name"]) res.status(400).json({ error: "Name Missing" });
  else if (!person["number"]) res.status(400).json({ error: "Number Missing" });
  else if (persons.some((p) => p.name === person.name))
    res.status(400).json({ error: `${person.name} already exists` });
  else {
    person = { ...person, id: uuid.v4() };
    persons = persons.concat(person);
    res.json(person);
  }
});

app.listen(3001);
