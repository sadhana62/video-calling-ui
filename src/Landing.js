import React, { useState, useEffect } from "react";
import UserDashboard from "./UserDashboard";

function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#00B5D9]/90">
      <div className="bg-white rounded-2xl p-8 w-full max-w-sm relative">
        <button
          className="absolute top-2 right-2 text-black text-2xl hover:text-[#00B5D9]"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}

function Landing() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginSuccess, setLoginSuccess] = useState("");

  // Signup form state
  const [signupUsername, setSignupUsername] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirm, setSignupConfirm] = useState("");
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupError, setSignupError] = useState("");
  const [signupSuccess, setSignupSuccess] = useState("");

  // Google signup state
  const [googleSignupDisabled, setGoogleSignupDisabled] = useState(false);

  // Google login state
  const [googleLoginDisabled, setGoogleLoginDisabled] = useState(false);

  const [user, setUser] = useState(null);

  // Avatar slider state and logic
  const landingAvatars = [
    {
      src: "/images/avatar/Video-call.png",
      title: "Seamless Video Feature"
    },
    {
      src: "/images/avatar/high-quality-video.png",
      title: "Connect with the world"
    },
    {
      src: "/images/avatar/Share-Link.png",
      title: "Get Link to Share"
    },
    {
      src: "/images/avatar/Secure-call.png",
      title: "Secure Call"
    },
   
    {
      src: "/images/avatar/Messages-encripted.png",
      title: "Message Encripted"
    },
   
    {
      src: "/images/avatar/Plan-ahead.png",
      title: "Plan Ahead"
    },
  ];
  const [currentAvatar, setCurrentAvatar] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAvatar((prev) => (prev + 1) % landingAvatars.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [landingAvatars.length]);

  // Handle login submit
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");
    setLoginSuccess("");
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      setLoginSuccess(data.message);
      setLoginEmail("");
      setLoginPassword("");
      // Set user and close modal after successful login
      setTimeout(() => {
        setShowLogin(false);
        setLoginSuccess("");
        setUser({ username: data.username || loginEmail.split("@")[0], email: loginEmail });
      }, 2000);
    } catch (err) {
      setLoginError(err.message);
    } finally {
      setLoginLoading(false);
    }
  };

  // Handle signup submit
  const handleSignup = async (e) => {
    e.preventDefault();
    setSignupLoading(true);
    setSignupError("");
    setSignupSuccess("");
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: signupUsername,
          email: signupEmail,
          password: signupPassword,
          confirmPassword: signupConfirm
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Signup failed");
      setSignupSuccess(data.message);
      setSignupUsername("");
      setSignupEmail("");
      setSignupPassword("");
      setSignupConfirm("");
      // Close modal after successful signup
      setTimeout(() => {
        setShowSignup(false);
        setSignupSuccess("");
      }, 2000);
    } catch (err) {
      setSignupError(err.message);
    } finally {
      setSignupLoading(false);
    }
  };

  // Logout handler
  const handleLogout = () => {
    setUser(null);
  };

  if (user) {
    return <UserDashboard user={user} onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-3 sm:px-6 md:px-12 py-4 sm:py-8 md:py-12 mx-auto" style={{ background: '#00B5D9' }}>
      {/* Header with Login/Sign up */}
      <header className="w-full flex justify-end items-center mb-6 px-2 sm:px-8">
        <div className="flex gap-3 sm:gap-4">
          <button
            className="px-4 py-2 rounded-full bg-white text-black font-semibold hover:bg-yellow-300 transition border border-white"
            onClick={() => setShowLogin(true)}
          >
            Login
          </button>
          <button
            className="px-4 py-2 rounded-full bg-yellow-300 text-black font-semibold hover:bg-white transition border border-yellow-300"
            onClick={() => setShowSignup(true)}
          >
            Sign up
          </button>
        </div>
      </header>
      <section className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-between py-8 md:py-20 gap-10 md:gap-20 px-2 sm:px-8">
        {/* Left: Text and Actions */}
        <div className="flex-1 w-full max-w-full md:max-w-[650px] mb-10 md:mb-0 px-2 sm:px-4">
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-white mb-4 md:mb-8 leading-tight">
            UnifyCall <br />with one-click
          </h1>
          <h3 className="text-lg sm:text-xl md:text-3xl font-extrabold text-white mb-2 md:mb-4 leading-tight">
            Seamless Video Calling for Everyone
          </h3>
          <p className="text-sm sm:text-base md:text-lg text-white mb-6 md:mb-10 opacity-90">
            Experience effortless, playful video meetings—connect face-to-face, anytime, anywhere.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-6 md:mb-8 w-full">
            <button className="bg-black text-white rounded-full px-6 py-3 font-semibold text-base w-full sm:w-auto hover:bg-gray-800 transition">
              Try for free <span className="ml-1">▶️</span>
            </button>
            <button className="border border-white text-white rounded-full px-6 py-3 font-semibold text-base w-full sm:w-auto hover:bg-white hover:text-black transition bg-transparent">
              Get a Demo
            </button>
          </div>
        </div>
        {/* Right: Image Slider */}
        <div className="flex-1 w-full max-w-full md:max-w-[650px] flex flex-col gap-4 md:gap-6 items-center md:items-end pr-0 md:pr-8">
          <div className="w-full flex justify-center md:justify-end">
            <div className="relative flex items-center justify-center w-full h-40 sm:h-56 md:w-[500px] md:h-[350px] lg:w-[650px] lg:h-[500px] mx-auto">
              <img
                src={landingAvatars[currentAvatar].src}
                alt={landingAvatars[currentAvatar].title}
                className="rounded-3xl w-full h-full object-contain transition-all duration-700 bg-[#00B5D9] mx-auto"
              />
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/80 px-3 py-1 rounded-lg text-black font-medium text-xs md:text-sm text-center">
                {landingAvatars[currentAvatar].title}
              </div>
              {/* Slider dots */}
              <div className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {landingAvatars.map((_, idx) => (
                  <button
                    key={idx}
                    className={`w-2 h-2 md:w-3 md:h-3 rounded-full border border-white ${currentAvatar === idx ? 'bg-black' : 'bg-white/60'}`}
                    onClick={() => setCurrentAvatar(idx)}
                    aria-label={`Go to avatar slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Trusted by Section */}
      <section className="w-full max-w-6xl px-3 sm:px-8 py-8 flex flex-col items-center">
        <span className="text-white mb-4">Trusted by teams and professionals worldwide.</span>
        <div className="flex flex-wrap gap-8 justify-center items-center">
          <span className="text-white font-bold text-lg sm:text-xl">stripe</span>
          <span className="text-white font-bold text-lg sm:text-xl">loom</span>
          <span className="text-white font-bold text-lg sm:text-xl">WhatsApp</span>
          <span className="text-white font-bold text-lg sm:text-xl">YouTube</span>
          <span className="text-white font-bold text-lg sm:text-xl">zoom</span>
        </div>
      </section>
      {/* Features Section */}
      <section className="w-full max-w-6xl px-3 sm:px-8 py-12">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-6">Flexible, Powerful Video Calling</h2>
        <p className="text-base sm:text-lg text-white mb-4 opacity-90">Virtual communication is made easier and more efficient with our platform's innovative video call features. Have seamless face-to-face conversations and collaborate in real time.</p>
      </section>
      {/* Login Modal */}
      <Modal open={showLogin} onClose={() => setShowLogin(false)}>
        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="loginEmail" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="loginEmail"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#00B5D9] focus:ring-[#00B5D9] text-base h-12 py-3 px-4"
              required
            />
          </div>
          <div>
            <label htmlFor="loginPassword" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="loginPassword"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#00B5D9] focus:ring-[#00B5D9] text-base h-12 py-3 px-4"
              required
            />
          </div>
          {loginError && <p className="text-red-500 text-sm">{loginError}</p>}
          {loginSuccess && <p className="text-green-500 text-sm">{loginSuccess}</p>}
          <button
            type="submit"
            disabled={loginLoading}
            className="w-full bg-[#00B5D9] text-white rounded-full px-4 py-2 font-semibold text-base hover:bg-blue-700 transition"
          >
            {loginLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </Modal>

      {/* Signup Modal */}
      <Modal open={showSignup} onClose={() => setShowSignup(false)}>
        <h2 className="text-2xl font-bold text-center mb-4">Sign Up</h2>
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label htmlFor="signupUsername" className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              id="signupUsername"
              value={signupUsername}
              onChange={(e) => setSignupUsername(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#00B5D9] focus:ring-[#00B5D9] text-base h-12 py-3 px-4"
              required
            />
          </div>
          <div>
            <label htmlFor="signupEmail" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="signupEmail"
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#00B5D9] focus:ring-[#00B5D9] text-base h-12 py-3 px-4"
              required
            />
          </div>
          <div>
            <label htmlFor="signupPassword" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="signupPassword"
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#00B5D9] focus:ring-[#00B5D9] text-base h-12 py-3 px-4"
              required
            />
          </div>
          <div>
            <label htmlFor="signupConfirm" className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              id="signupConfirm"
              value={signupConfirm}
              onChange={(e) => setSignupConfirm(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#00B5D9] focus:ring-[#00B5D9] text-base h-12 py-3 px-4"
              required
            />
          </div>
          {signupError && <p className="text-red-500 text-sm">{signupError}</p>}
          {signupSuccess && <p className="text-green-500 text-sm">{signupSuccess}</p>}
          <button
            type="submit"
            disabled={signupLoading}
            className="w-full bg-[#00B5D9] text-white rounded-full px-4 py-2 font-semibold text-base hover:bg-blue-700 transition"
          >
            {signupLoading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
      </Modal>
    </div>
  );
}

export default Landing; 