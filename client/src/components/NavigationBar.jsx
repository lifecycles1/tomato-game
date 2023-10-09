import { Link } from "react-router-dom";
import logo from "../assets/logo.jpg";
import { useNavigate } from "react-router-dom";

const NavigationBar = () => {
  const navigate = useNavigate();

  const navLinks = [
    { to: "/home", label: "Game" },
    { to: "/highscores", label: "High Scores" },
  ];

  // Function to handle logout
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="bg-blue-500 p-4 flex justify-between items-center">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <img src={logo} alt="Logo" className="w-8 h-8 rounded-full" />
        <span className="text-white text-lg font-semibold">TMG</span>
      </div>

      {/* Navigation Links */}
      <div className="space-x-4">
        {navLinks.map((link) => (
          <Link key={link.to} to={link.to} className="text-white hover:text-gray-300">
            {link.label}
          </Link>
        ))}
      </div>

      {/* Logout Button */}
      <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
        Logout
      </button>
    </nav>
  );
};

export default NavigationBar;
