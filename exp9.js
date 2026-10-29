// Install: npm install express mongoose

const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

// Database Connection
mongoose.connect("mongodb://127.0.0.1:27017/MovieDB")
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(3000, () => console.log("Server running on port 3000"));
  })
  .catch(err => console.log(err));

// Movie Schema
const Movie = mongoose.model("Movie", new mongoose.Schema({
  movieTitle: { type: String, required: true, trim: true },
  genre: { type: String, required: true, trim: true },
  releaseYear: {
    type: Number,
    required: true,
    min: 1888,
    max: new Date().getFullYear() + 10,
    validate: Number.isInteger
  },
  language: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 10 }
}));

// CREATE Movie
app.post("/movies", async (req, res) => {
  try {
    res.status(201).json(await Movie.create(req.body));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ All Movies
app.get("/movies", async (req, res) => {
  res.json(await Movie.find());
});

// READ Movie by ID
app.get("/movies/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });
    res.json(movie);
  } catch {
    res.status(400).json({ message: "Invalid movie ID" });
  }
});

// UPDATE Movie
app.put("/movies/:id", async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id, req.body, { new: true, runValidators: true }
    );
    if (!movie) return res.status(404).json({ message: "Movie not found" });
    res.json(movie);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE Movie
app.delete("/movies/:id", async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });
    res.json({ message: "Movie deleted successfully" });
  } catch {
    res.status(400).json({ message: "Invalid movie ID" });
  }
});

// SEARCH Movie by Title
app.get("/search/:title", async (req, res) => {
  res.json(await Movie.find({
    movieTitle: { $regex: req.params.title, $options: "i" }
  }));
});