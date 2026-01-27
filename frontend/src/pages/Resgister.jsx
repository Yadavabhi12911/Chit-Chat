import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../store/auth.slice";
import Toast from "../components/Toast";

const Resgister = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [validationError, setValidationError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated } = useSelector((state) => state.auth);

  // Navigate when registration is successful
  useEffect(() => {
    if (isAuthenticated) {
      setToastMessage("Account created successfully! Welcome to ChitChat 🎉");
      setToastType("success");
      setShowToast(true);
      // Navigate after showing toast
      setTimeout(() => {
        navigate("/");
      }, 2000);
    }
  }, [isAuthenticated, navigate]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setValidationError("");
    setShowToast(false);

    if (password !== confirmPassword) {
      setValidationError("Passwords do not match");
      return;
    }

    await dispatch(register({
      name,
      username,
      email,
      password,
      avatar
    }));
  };

  // Show error toast when there's an error
  useEffect(() => {
    if (error && !isLoading) {
      setToastMessage(error);
      setToastType("error");
      setShowToast(true);
    }
  }, [error, isLoading]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-950 to-cyan-900 flex items-center justify-center p-4">
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}
      
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-6">
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-white mb-1">
            Join ChitChat
          </h1>
          <p className="text-white/80 text-xs">
            Connect with friends in real-time
          </p>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-3">
          {validationError && (
            <div className="bg-red-500/20 border border-red-500 text-red-200 px-3 py-2 rounded-lg text-xs">
              {validationError}
            </div>
          )}

          <div className="space-y-1">
            <label htmlFor="name" className="block text-white/90 text-xs font-medium">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              id="name"
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full bg-white/10 border border-white/30 rounded-lg px-3 py-2 text-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all backdrop-blur-sm"
              required
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="username" className="block text-white/90 text-xs font-medium">
              Username
            </label>
            <input
              type="text"
              value={username}
              id="username"
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a unique username"
              className="w-full bg-white/10 border border-white/30 rounded-lg px-3 py-2 text-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all backdrop-blur-sm"
              required
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="email" className="block text-white/90 text-xs font-medium">
              Email
            </label>
            <input
              type="email"
              value={email}
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full bg-white/10 border border-white/30 rounded-lg px-3 py-2 text-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all backdrop-blur-sm"
              required
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="avatar" className="block text-white/90 text-xs font-medium">
              Profile Picture
            </label>
            <input
              type="file"
              id="avatar"
              accept="image/*"
              onChange={(e) => setAvatar(e.target.files[0])}
              className="w-full bg-white/10 border border-white/30 rounded-lg px-3 py-2 text-sm text-white file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-cyan-900 file:text-white hover:file:bg-cyan-950 cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all backdrop-blur-sm"
              required
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="block text-white/90 text-xs font-medium">
              Password
            </label>
            <input
              type="password"
              value={password}
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full bg-white/10 border border-white/30 rounded-lg px-3 py-2 text-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all backdrop-blur-sm"
              required
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="confirmPassword" className="block text-white/90 text-xs font-medium">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              id="confirmPassword"
              placeholder="Confirm your password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-white/10 border border-white/30 rounded-lg px-3 py-2 text-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all backdrop-blur-sm"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-cyan-900 to-cyan-950 hover:from-cyan-950 hover:to-cyan-900 text-white font-semibold py-2 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Account...
              </span>
            ) : (
              "Create Account"
            )}
          </button>

          <div className="text-center pt-2">
            <p className="text-white/70 text-xs">
              Already have an account?{" "}
              <Link to="/login" className="text-cyan-300 hover:text-cyan-200 font-medium transition-colors">
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Resgister;
