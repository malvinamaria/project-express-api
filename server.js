import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';

const mongoURL = process.env.MONGO_URL || 'mongodb://localhost/Validation';
mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

//create a model for mongo db
const Person = mongoose.model('Person', {
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 500,
  },
  height: {
    type: Number,
    required: true,
    min: 5,
  },
  birthdate: {
    type: Date,
    default: Date.now,
  },
});

new Person({ name: 'Malwina', height: 180 }).save();

const port = process.env.PORT || 1080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(bodyParser.json());

// http://localhost:7080/
app.get('/', (req, res) => {
  res.send('Hello hello');
});

// http://localhost:7080/people - get all people from the database
app.post('/people', async (req, res) => {
  try {
    // success case
    //async await is a promise that will wait for the response
    const person = await new Person(req.body).save();
    res.status(200).json(person);
  } catch (err) {
    res
      .status(400)
      .json({ message: 'Could not save person', error: err.errors });
  }
  // above or below
  // const person = new Person(req.body); //create a new person based on the model
  // const savedPerson = await person.save(); //save the person to the database and wait for the response
  // res.json(savedPerson) //return the saved person in the response
});
// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
