import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';

//created connection to mongo database
const mongoURL = process.env.MONGO_URL || 'mongodb://localhost/post-codealong';
mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// created a model for the tasks with some validation rules
const Task = mongoose.model('Task', {
  text: {
    type: String,
    required: true,
    minlength: 5,
  },
  complete: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const port = process.env.PORT || 2080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(bodyParser.json());

// http://localhost:7080/
app.get('/', (req, res) => {
  res.send('Hello hello');
});

// using express to create an endpoint that returns all tasks
app.get('/tasks', async (req, res) => {
  const tasks = await Task.find().sort({ createdAt: 'desc' }).limit(20).exec();
  res.json(tasks);
});

// using express to add a new task to the database
app.post('/tasks', async (req, res) => {
  // retrieve information sent by client to our API endpoint
  const { text, complete } = req.body;
  // use our mongoose model to create the database entry
  const task = new Task({ text, complete });
  try {
    // success
    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (err) {
    // bad request
    res
      .status(400)
      .json({ message: 'Could not save task to database', errors: err.errors });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
