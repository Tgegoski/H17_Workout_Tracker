const router = require("express").Router();
const Transaction = require("../models/workout.js");
const { db } = require("../models/workoutModel.js");

router.post("/api/workout", ({ body }, res) => {
  Workout.create(body)
    .then(dbWorkout => {
      res.json(dbWorkout);
    })
    .catch(err => {
      res.status(400).json(err);
    });
});

router.post("/api/transaction/bulk", ({ body }, res) => {
  Transaction.insertMany(body)
    .then(dbTransaction => {
      res.json(dbTransaction);
    })
    .catch(err => {
      res.status(400).json(err);
    });
});

router.get("/api/transaction", (req, res) => {
  Transaction.find({})
    .sort({ date: -1 })
    .then(dbTransaction => {
      res.json(dbTransaction);
    })
    .catch(err => {
      res.status(400).json(err);
    });
});

db.workout.aggregate( [
    { 
        $addFields: {
            totalExercises: { $sum: "$exercises" },
            totalDuration: { $sum: "$duration" }
        }
    },
    {
        $addFields: { totalDuration: 
            { $add: ["$totalExercises","$totalDuration","$totalWorkout"]}}
    }
])

module.exports = router;
