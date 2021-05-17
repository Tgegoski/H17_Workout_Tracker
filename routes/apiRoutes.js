const router = require("express").Router();
const Workout = require("../models/workout.js");
const { db } = require("../models/workoutModel.js");

const apiRoutes = require('./api');
const htmlRoutes = require('./html-routes.js');

router.use('/', htmlRoutes);
router.use('/api', apiRoutes);


router.post("/api/workout", ({ body }, res) => {
  Workout.create(body)
    .then(dbWorkout => {
      res.json(dbWorkout);
    })
    .catch(err => {
      res.status(400).json(err);
    });
});

router.get("/api/workouts", (req, res) => {
  db.workout.aggregate( [
    { 
        $addFields: {
            totalExercises: { $sum: "$exercises" },
            totalDuration: { $sum: "$duration" }
        }
    },
    {
        $addFields: { totalDuration: 
            { $add: ["$totalExercises","$totalDuration","$totalWorkout"] }}
    }
])
     
  Workout.find({})
    .sort({ date: -1 })
    .then(dbWorkout => {
      res.json(dbWorkout);
    })
    .catch(err => {
      res.status(400).json(err);
    });
});

router.put("/api/workouts/:id", (req, res) => {
    dbWorkout.findOneAndUpdate(
      {
         _id: req.params.id
      },
      { $inc: {
        totalDuration: req.body.totalDuration
      },
      $push: { 
        workouts: req.body
      }
    },
    { 
      new: true
    }
)
    .then(dbWorkout => {
      res.json(dbWorkout);
    })
    .catch(err => {
      res.status(400).json(err);
    })
})

router.get("/api/workouts/range", (req, res) => {
  dbWorkout.find({})
  db.workout.aggregate( [
    { 
        $addFields: {
            totalWorkout: { $sum: "$workouts" },
            totalInRange: { $sum: "$inRange" }
        }
    },
    {
        $addFields: { totalInRange: 
            { $add: ["$totalWorkouts","$totalInRange"] }}
    }
  ])
}

).sort({ "id": 1, "day": 1 })
    .limit (7)
    .then(dbWorkouts => {
      res.json(dbWorkouts);
    })
    .catch(err => {
      res.status(400).json(err);
  });

module.exports = router;
