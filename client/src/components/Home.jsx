import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import HighScores from "./HighScores";
import background from "../assets/background.jpg";

// Home component
const Home = () => {
  const location = useLocation();
  const [question, setQuestion] = useState("");
  const [solution, setSolution] = useState(null);
  const [guess, setGuess] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [countdown, setCountdown] = useState(100);
  const [score, setScore] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isIncorrect, setIsIncorrect] = useState(false);

  // Function to fetch a new question from the API
  const fetchQuestion = async () => {
    try {
      const response = await axios.get("https://marcconrad.com/uob/tomato/api.php");

      // Reset the score if the game is over
      if (isGameOver) {
        setScore(0);
      }

      const data = response.data;
      setQuestion(data.question);
      setSolution(data.solution);
      setIsGameOver(false);
      setGuess("");
      setCountdown(100);
      setAttempts(0);
    } catch (error) {
      console.error("Error fetching question:", error);
    }
  };

  // Fetch the initial question when the component mounts
  useEffect(() => {
    fetchQuestion();
  }, []);

  // Countdown timer logic
  useEffect(() => {
    if (!isGameOver) {
      const timer = setInterval(() => {
        if (countdown > 0) {
          setCountdown(countdown - 1);
        } else {
          // Game over if countdown reaches 0
          setIsGameOver(true);
          // Send the score to the database if time runs out
          sendScoreToDatabase();
        }
      }, 1000);

      // Clear the timer when the component unmounts or the game is over
      return () => clearInterval(timer);
    }
  }, [countdown, isGameOver]);

  // Function to send the score to the database
  const sendScoreToDatabase = async () => {
    if (score > 0) {
      console.log("Sending score to the database...", score);
      try {
        const response = await axios.post("http://localhost:8000/score", {
          email: location.state.id,
          score: score,
        });
        // Handle the response from the server if needed
        console.log("Score sent to the database:", response.data);
      } catch (error) {
        console.error("Error sending score to the database:", error);
      }
    }
  };

  // Function to handle the user's guess
  const handleGuess = () => {
    if (parseInt(guess) === solution) {
      // Correct guess, increment score and fetch a new question
      setScore(score + 1);
      fetchQuestion();
      setIsCorrect(true); // Set to true to trigger the CSS animation
    } else {
      // Incorrect guess, increment attempts
      setAttempts(attempts + 1);
      setIsIncorrect(true); // Set to true to trigger the red CSS animation
      if (attempts >= 2) {
        // Game over if 3 failed attempts
        setIsGameOver(true);
        // Send the score to the database if attempts run out
        sendScoreToDatabase();
      }
      // Clear the guess
      setGuess("");
    }
  };

  // reset isCorrect after 1 second to allow "Score" CSS animation to play again
  useEffect(() => {
    if (isCorrect) {
      const timeout = setTimeout(() => {
        setIsCorrect(false);
      }, 1000);

      // Clear the timeout when the component unmounts
      return () => clearTimeout(timeout);
    }
  }, [isCorrect]);

  // reset isInCorrect after 1 second to allow "attempts left" CSS animation to play again
  useEffect(() => {
    if (isIncorrect) {
      const timeout = setTimeout(() => {
        setIsIncorrect(false);
      }, 1000);

      // Clear the timeout when the component unmounts
      return () => clearTimeout(timeout);
    }
  }, [isIncorrect]);

  // button to reset the game
  const resetGame = () => {
    sendScoreToDatabase(); // Send the score to the database
    fetchQuestion(); // Fetch the initial question
    setScore(0); // Reset the score
  };

  // button to play again after game over
  const playAgain = () => {
    fetchQuestion(); // Fetch the initial question
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 bg-cover bg-no-repeat" style={{ backgroundImage: `url(${background})` }}>
      {isGameOver ? (
        <div className="flex flex-col items-center">
          <h1 className="text-3xl font-bold text-red-500 mb-5">Game Over</h1>
          <HighScores />
          <button onClick={playAgain} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            Play Again
          </button>
        </div>
      ) : (
        <div>
          <h1>
            Hello <span className="text-2xl font-semibold">{location.state.id.split("@")[0]}</span>, and welcome to the
          </h1>
          <h1 className="text-3xl font-bold">Tomato Math Game</h1>
          <img
            src={question}
            alt="Math Game"
            className="mt-4 mb-4 max-w-md rounded-xl"
            style={{
              borderLeft: "2px solid pink",
              borderTop: "2px solid green",
              borderRight: "2px solid yellow",
              borderBottom: "2px solid blue",
            }}
          />

          <div className="flex space-x-2">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
              <button key={number} onClick={() => setGuess(number)} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                {number}
              </button>
            ))}
          </div>

          <div className="mt-4 flex">
            <input type="text" value={guess} readOnly className="px-4 py-2 border rounded-lg text-center" />
            <button onClick={() => setGuess("")} className="px-4 py-2 ml-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
              Clear
            </button>
            <div className={`pl-5 ml-24 mt-2 text-xl ${isCorrect ? "green-score" : ""}`}>Score: {score}</div>
          </div>

          <p className="mt-4 flash-text">Time Left: {countdown} seconds</p>
          <p className={`${isIncorrect ? "red-score" : ""}`}>Attempts Remaining: {3 - attempts}</p>

          <div className="flex justify-between">
            <button onClick={handleGuess} className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
              Guess
            </button>
            <button onClick={resetGame} className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
              Start New Game
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
