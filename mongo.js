const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("Password missing");
  process.exit(1);
}

const password = process.argv[2];
const url = `mongodb+srv://chapagainsakshyam:${password}@cluster0.x12qe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set("strictQuery", false);
mongoose.connect(url).catch((err) => console.log(err));

const phoneSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", phoneSchema);

if (process.argv[3] && process.argv[4]) {
  const personName = process.argv[3];
  const personNumber = process.argv[4];

  const phoneNumber = new Person({ name: personName, number: personNumber });

  phoneNumber.save().then((res) => {
    console.log(`added ${personName} number ${personNumber} to phonebook`);
    mongoose.connection.close();
  });
} else {
  Person.find({}).then((result) => {
    console.log("phonebook");
    result.forEach((phone) => {
      console.log(`${phone.name} ${phone.number}`);
    });
    mongoose.connection.close();
  });
}
