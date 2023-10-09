import { useState, useEffect } from "react";
import axios from "axios";
import HighScores from "./HighScores";
import background from "../assets/background.jpg";
import jwt_decode from "jwt-decode";
import Loading from "./Loading";
import { sendScoreToDatabase } from "../utils/scoreUtils";

// MathGame component
const MathGame = () => {
  const [question, setQuestion] = useState("");
  const [solution, setSolution] = useState(null);
  const [answer, setAnswer] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [countdown, setCountdown] = useState(100);
  const [score, setScore] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isIncorrect, setIsIncorrect] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to fetch a new question from the API
  const fetchQuestion = async () => {
    try {
      const response = await axios.get("https://marcconrad.com/uob/tomato/api.php");
      // Reset the score if the game is over
      if (isGameOver) setScore(0);
      const data = response.data;
      setQuestion(data.question);
      setSolution(data.solution);
      setIsGameOver(false);
      setAnswer("");
      setCountdown(100);
      setAttempts(0);
      setLoading(false);
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
          sendScoreToDatabase(user.email, score);
        }
      }, 1000);

      // Clear the timer when the component unmounts or the game is over
      return () => clearInterval(timer);
    }
  }, [countdown, isGameOver]);

  // Function to submit the user's answer
  const submitAnswer = () => {
    if (answer === solution) {
      // Correct answer, increment score and fetch a new question
      setScore(score + 1);
      fetchQuestion();
      setIsCorrect(true); // Set to true to trigger green "score" text CSS animation
    } else {
      // Incorrect answer, increment attempts
      setAttempts(attempts + 1);
      setIsIncorrect(true); // Set to true to trigger the red "attempts left" text CSS animation
      if (attempts >= 2) {
        // Game over if 3 failed attempts
        setIsGameOver(true);
        // Send the score to the database if attempts run out
        sendScoreToDatabase(user.email, score);
      }
      // Clear the answer
      setAnswer("");
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
    sendScoreToDatabase(user.email, score);
    fetchQuestion();
    setScore(0);
  };

  // button to play again after game over
  const playAgain = () => {
    fetchQuestion(); // Fetch the initial question
  };

  // decode token and get the user's id and username from the token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwt_decode(token);
      setUser(decodedToken);
    }
  }, []);

  // if loading, display loading message
  if (loading) return <Loading />;

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-cover bg-no-repeat" style={{ backgroundImage: `url(${background})` }}>
      {isGameOver ? (
        <div className="flex flex-col items-center">
          <h1 className="text-3xl font-bold text-red-500 mb-5">Game Over</h1>
          <HighScores />
          <button onClick={playAgain} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            Play Again
          </button>
        </div>
      ) : (
        <div className="-mt-24">
          <h1 className="absolute top-2 left-36">
            Hello <span className="text-2xl font-semibold">{user?.email?.split("@")[0]}</span>, and welcome to the
          </h1>
          <h1 className="text-3xl font-bold">Tomato Math Game</h1>
          <h2 className="text-2xl font-semibold">Can you solve this equation?</h2>
          <p className="mt-4 flash-text absolute top-36 left-36">Time Left: {countdown} seconds</p>
          <p className={`absolute top-48 left-36 ${isIncorrect && "red-score"}`}>Attempts Remaining: {3 - attempts}</p>
          <div className={`text-xl absolute top-60 left-44 ${isCorrect && "green-score"}`}>Score: {score}</div>
          <button onClick={resetGame} className="absolute top-10 right-20 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
            Start New Game
          </button>
          <div className="flex items-center mt-4 mb-4 max-w-md rounded-xl border-2 border-l-pink-500 border-t-green-500 border-r-yellow-500 border-b-blue-500">
            <img src={question} alt="Math Game" />
          </div>

          <div className="flex space-x-2">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
              <button key={number} onClick={() => setAnswer(number)} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                {number}
              </button>
            ))}
          </div>

          <div className="mt-4 flex justify-between">
            <button onClick={submitAnswer} className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
              Submit Answer
            </button>
            <input type="text" value={answer} readOnly className="px-4 py-2 border rounded-lg text-center border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400" />
            <button onClick={() => setAnswer("")} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MathGame;
