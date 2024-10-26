const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;

mongoose.set("strictQuery", false);
console.log("connecting to", url);

const numberValidator = (number) => {
  number = number.trim();
  // if (number.length < 8) return false;
  const [p1, p2] = number.split("-");

  if (isNaN(Number(p1)) || isNaN(Number(p2))) return false;
  console.log("\n\n\n\n\n\n\n\n")
  console.log(p1.length != 2 || p1.length != 3);
  
  if (!(p1.length === 2 || p1.length === 3)) return false;

  return true;
};

mongoose
  .connect(url)
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    required: true,
    minLength: 8,
    validate: numberValidator,
  },
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
