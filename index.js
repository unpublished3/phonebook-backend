const express = require("express");
const app = express();

persons = [
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

app.listen(3001);
