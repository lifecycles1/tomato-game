import HighScores from "./HighScores";
import background from "../assets/background.jpg";
import { useNavigate } from "react-router-dom";

const HighScoresPage = () => {
  const navigate = useNavigate();

  const play = () => {
    navigate("/home");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 bg-cover bg-no-repeat" style={{ backgroundImage: `url(${background})` }}>
      <div className="flex flex-col items-center">
        <HighScores />
        <button onClick={play} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          Play
        </button>
      </div>
    </div>
  );
};

export default HighScoresPage;
