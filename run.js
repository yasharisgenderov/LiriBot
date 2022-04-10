const dotenv = require("dotenv");
dotenv.config();
const axios = require("axios");
var Spotify = require("node-spotify-api");
const inquirer = require("inquirer");

function mainInquirer() {
  inquirer
    .prompt([
      {
        message: "Hello! I am LiriBot!",
        name: "user",
      },
      {
        message: "Choose your social media?",
        type: "list",
        choices: ["Spotify", "OMDB", "Twitter"],
        name: "Social",
      },
    ])
    .then((answers) => {
      console.log(answers);
      if (answers.Social === "Spotify") {
        spotifyInquirer();
      } else if (answers.Social === "OMDB") {
        omdbInquirer();
      } else if (answers.Social === "Twitter") {
        tweeterInquirer();
      }
    });
}

mainInquirer();

async function continueInquirer() {
  let continueAnswer = await inquirer.prompt([
    {
      message: "Do you want to continue?",
      type: "confirm",
      name: "confirm",
    },
  ]);
  if (continueAnswer.confirm) {
    console.clear();
    mainInquirer();
  } else {
    console.clear();
    console.log("Thank you for using our Bot! See you soon.");
  }
}

function spotifyInquirer() {
  inquirer
    .prompt([
      {
        message: "Which music do you want to listen?",
        type: "text",
        name: "song",
      },
    ])
    .then((answers) => {
      getSongSpotify(answers.song);
    });
}

function omdbInquirer() {
  inquirer
    .prompt([
      {
        message: "Which film do you want to watch?",
        type: "text",
        name: "film",
      },
    ])
    .then((answers) => {
      getFilmOmdb(answers.film);
    });
}

function tweeterInquirer() {
  inquirer
    .prompt([
      {
        message: "Which tweets do you want to see?",
        type: "text",
        name: "tweet",
      },
    ])
    .then((answers) => {
      getTweets(answers.tweet);
    });
}

function getSongSpotify(songName) {
  var spotify = new Spotify({
    id: process.env.SPOTIFY_ID,
    secret: process.env.SPOTIFY_SECRET,
  });

  spotify
    .search({ type: "track", query: songName })
    .then(function (response) {
      let data = response.tracks.items;
      for (let i = 0; i < data.length; i++) {
        console.log(data[i].album.name);
      }
      continueInquirer();
    })
    .catch(function (err) {
      console.log(err);
    });
}

async function getFilmOmdb(film) {
  let res = await axios.get(`http://www.omdbapi.com/?apikey=trilogy&t=${film}`);
  console.log("Film Title", res.data.Title);
  console.log("Film Year", res.data.Year);
  console.log("Film imdbRating", res.data.imdbRating);
  console.log("Film Country", res.data.Country);
  console.log("Film Language", res.data.Language);
  console.log("Film Plot :", res.data.Plot);
  console.log("Film Actors :", res.data.Actors);
  continueInquirer();
}

function getTweets(word) {
  const options = {
    method: "GET",
    url: "https://twitter135.p.rapidapi.com/Search/",
    params: { q: `${word}`, count: "20" },
    headers: {
      "X-RapidAPI-Host": "twitter135.p.rapidapi.com",
      "X-RapidAPI-Key": "bc19c5cca7msh991de7df948597ep15f052jsna03a21cf14e7",
    },
  };

  axios
    .request(options)
    .then((response) => {
      let data = response.data.globalObjects.tweets;
      var dataVal = Object.values(data);
      dataVal.map((q) => {
        console.log(q.full_text);
      });
      continueInquirer();
    })
    .catch(function (error) {
      console.error(error);
    });
}
