import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';

const mongoURL = process.env.MONGO_URL || 'mongodb://localhost/notes';
mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const Note = mongoose.model('Note', {
  text: String,
  createdAt: {
    type: Date,
    default: () => new Date(),
  },
});

const port = process.env.PORT || 6080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(bodyParser.json());

// http://localhost:7080/
app.get('/', (req, res) => {
  res.send('Hello hello');
});

app.post('/notes', async (req, res) => {
  // console.log(req.body);
  // res.send('All notes');
  const note = new Note({ text: req.body.text });
  await note.save();
  res.json(note);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
