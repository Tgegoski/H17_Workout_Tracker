const router = require("express").Router();
const Workout = require("../models/workout.js");
// const mongoose = require("mongoose");

// const apiRoutes = require('./api-routes');
// const htmlRoutes = require('./html-routes.js');

// router.use('/', htmlRoutes);
// router.use('/api', apiRoutes);

router.post("/api/workout", ({ body }, res) => {
  Workout.create(body)
    .then((dbWorkout) => {
      res.json(dbWorkout);
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
    .then((dbWorkout) => {
      res.json(dbWorkout);
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
    .then((dbWorkout) => {
      res.json(dbWorkout);
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
    .then((dbWorkouts) => {
      res.json(dbWorkouts);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

module.exports = router;
