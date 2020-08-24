const express = require("express");
const cors = require("cors");
const monk = require("monk");

const app = express();

const db = monk("localhost/fitjournal");
const exercises = db.get("exercises");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "HelloTest",
  });
});

function isValidExercise(exercise) {
  return (
    exercise.type &&
    exercise.type.toString().trim() !== "" &&
    exercise.sets &&
    exercise.sets.toString().trim() !== "" &&
    exercise.reps &&
    exercise.reps.toString().trim() !== ""
  );
}

app.post("/exercise", (req, res) => {
  if (isValidExercise(req.body)) {
    // insert into db...
    const exercise = {
      type: req.body.type.toString(),
      sets: req.body.sets.toString(),
      reps: req.body.reps.toString(),
    };

    exercises.insert(exercise).then((createdExercise) => {
      res.json(createdExercise);
    });
  } else {
    res.status(422);
    res.json({
      message: "Exercise requires type, sets and reps!",
    });
  }
});

app.listen(5000, () => {
  console.log("Listening on http://localhost:5000");
});
