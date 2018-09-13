// ===============================================================================
// LOAD DATA
// We are linking our routes to a series of "data" sources.
// These data sources hold arrays of information on table-data, waitinglist, etc.
// ===============================================================================

var friendsData = require("../data/friends");

// ===============================================================================
// ROUTING
// ===============================================================================

module.exports = function(app) {
  // API GET Requests
  // Below code handles when users "visit" a page.
  // In each of the below cases when a user visits a link
  // (ex: localhost:PORT/api/admin... they are shown a JSON of the data in the table)
  // ---------------------------------------------------------------------------

  app.get("/api/friends", function(req, res) {
    res.json(friendsData);
  });

  app.post("/api/friends", function(req, res) {
    // First lets put the users score into a variable so we aren't playing around with hardcode
    var userScore = req.body.scores;
    var userName = req.body.name;
    var userPhoto = req.body.photo;

    //Lets create an array of all the score difference totals.
    var scoreDifferencesArray = [];
    var identicalData = false;
    //Next we will create a for loop to execute our 'array subtraction' with the users score
    //and every other users score in our database.
    for (var i = 0; i < friendsData.length; i++) {
      //Start the loop with a fresh scoreDifferences so that when we compare scores of a new user
      //we aren't mixing old score differences
      var scoreDifferences = 0;

      //So we don't get ourselves as a best friend result we are going to
      //add a continue statement in our for loop so that it 'jumps over'
      //one interation when it compares name, image, and score array of the
      //current user and an identical user in the database.
      if (userName === friendsData[i].name) {
        //Lets add an arbitrary value that can never be reached at
        //the index where the user sees themselves in the database
        //(I tried null, but that causes an issue where once the user
        //hits the submit button a second time without changing any information
        //on the form, the modal won't appear again. Unlike the solution with an arbitrary value
        //that can never be reached, the user can press the submit button a second time
        //without changing anything and have the modal appear).
        scoreDifferencesArray.push(999);
        identicalData = true;

        //Here is the keyword used in a for loop to skip/jump over
        //the iteration where the if condition is met.
        continue;
      }

      //This loop will be to go through our scores array
      for (var j = 0; j < userScore.length; j++) {
        scoreDifferences += Math.abs(userScore[j] - friendsData[i].scores[j]);
      }
      //We will push the total score difference into an array
      scoreDifferencesArray.push(scoreDifferences);
    }

    //Once we are done comparing all the scores and have all of our total score
    //differences into an array together, we can look through our array for the smallest
    //number and ask for the index it is in. This should give us the user with the least
    //score difference since that users index should be the same index location as our
    //scoreDifferencesArray
    var bestFriendIndex = scoreDifferencesArray.indexOf(
      Math.min.apply(null, scoreDifferencesArray)
    );

    //Here we have our response
    res.json(friendsData[bestFriendIndex]);

    //I would like to add validation to this array push so that if the data already exists it
    //won't push the same req.body and create duplicates.
    if (!identicalData) {
      friendsData.push(req.body);
    }
  });
};
