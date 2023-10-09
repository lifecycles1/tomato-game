import axios from "axios";

const sendScoreToDatabase = async (email, score) => {
  if (score > 0) {
    try {
      const response = await axios.post("http://localhost:8000/score", {
        email: email,
        score: score,
      });
      // Handle the response from the server if needed
      console.log("Score sent to the database:", response.data);
    } catch (error) {
      console.error("Error sending score to the database:", error);
    }
  }
};

export { sendScoreToDatabase };
