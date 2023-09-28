import axios from "axios";
import { useEffect, useState } from "react";

// HighScores component to display the high scores
const HighScores = () => {
  const [highScores, setHighScores] = useState([]);

  // function to fetch high scores from the database
  const fetchHighScores = async () => {
    try {
      const response = await axios.get("http://localhost:8000/highscores");
      setHighScores(response.data);
    } catch (error) {
      console.error("Error fetching high scores:", error);
    }
  };

  // Fetch high scores when the component mounts
  useEffect(() => {
    fetchHighScores();
  }, []);

  return (
    <div className="w-72 h-72 border border-gray-300 rounded-lg p-4 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-2">High Scores</h2>
      <ul>
        {highScores.map((score, index) => (
          <li key={index} className="mb-2 py-2 px-2 border-b border-gray-400 flex justify-between">
            <span className="font-medium truncate">
              {index + 1} - {score.email}
            </span>{" "}
            <span className="">{score.score}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HighScores;
