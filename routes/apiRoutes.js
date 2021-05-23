const router = require("express").Router();
const Workout = require("../models/workout.js");

router.post("/api/workout", ({ body }, res) => {
  Workout.create(body)
    .then((Workout) => {
      res.json(Workout);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

router.get("/api/workout", (req, res) => {
  Workout.aggregate([
    {
      $addFields: {
        totalExercises: { $sum: "$exercises" },
        totalDuration: { $sum: "$duration" },
      },
    },
    {
      $addFields: {
        totalDuration: {
          $add: ["$totalExercises", "$totalDuration", "$totalWorkout"],
        },
      },
    },
  ]);

  Workout.find({})
    .sort({ date: -1 })
    .then((Workout) => {
      res.json(Workout);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

router.put("/api/workout/:id", (req, res) => {
  dbWorkout
    .findOneAndUpdate(
      {
        _id: req.params.id,
      },
      {
        $inc: {
          totalDuration: req.body.totalDuration,
        },
        $push: {
          workouts: req.body,
        },
      },
      {
        new: true,
      }
    )
    .then((Workout) => {
      res.json(Workout);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

router.get("/api/workout/range", (req, res) => {
  Workout.aggregate([
    {
      $addFields: {
        totalWorkout: { $sum: "$workout" },
        totalInRange: { $sum: "$inRange" },
      },
    },
    {
      $addFields: {
        totalInRange: { $add: ["$totalWorkout", "$totalInRange"] },
      },
    },
  ])
    .sort({ id: 1, day: 1 })
    .limit(7)
    .then((Workouts) => {
      res.json(Workouts);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

module.exports = router;
