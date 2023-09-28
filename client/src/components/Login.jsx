import React from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const history = useNavigate();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  async function submit(e) {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/signin", { email, password }).then((res) => {
        if (res.data === email) {
          history("/home", { state: { id: email } });
        } else if (res.data === "email or password are incorrect") {
          alert("email or password are incorrect");
        }
      });
    } catch (error) {
      alert("error while logging in");
      console.log(error);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-6 space-y-8 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-extrabold text-center">Login</h1>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="block w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300" />
          </div>
          <div>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="block w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300" />
          </div>
          <div>
            <button type="submit" className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300">
              Login
            </button>
          </div>
        </form>
        <p className="text-center">OR</p>
        <div className="text-center">
          <Link to="/signup" className="text-blue-500 hover:underline">
            Signup Page
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;