import React, { useState, useEffect } from "react";
import UserDashboard from "./UserDashboard";

function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm relative">
        <button
          className="absolute top-2 right-2 text-black text-2xl hover:text-palette-lime"
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
    <div className="min-h-screen bg-palette-grayLight flex flex-col items-center px-2 sm:px-4 md:px-8 py-4 sm:py-6 md:py-8 mx-auto">
      {/* Header */}
      <header className="w-full flex justify-between items-center px-8 py-6 bg-palette-grayLight rounded-2xl">
        <div className="flex items-center gap-2">
          {/* <span className="font-extrabold text-2xl text-black">Tech.xyz</span> */}
        </div>
        <nav className="hidden md:flex gap-8 text-palette-black font-medium">
          <a href="#" className="hover:text-palette-blue">How it works</a>
          <a href="#" className="hover:text-palette-blue">Features</a>
          <a href="#" className="hover:text-palette-blue">Solutions</a>
          <a href="#" className="hover:text-palette-blue">Pricing</a>
        </nav>
        <div className="flex gap-4">
          <button
            className="px-4 py-2 rounded-lg text-palette-black font-semibold bg-palette-yellow hover:bg-palette-peach border border-palette-grayDark shadow"
            onClick={() => setShowLogin(true)}
          >
            Login
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-palette-blue text-palette-black font-semibold hover:bg-palette-green border border-palette-grayDark shadow"
            onClick={() => setShowSignup(true)}
          >
            Sign up
          </button>
        </div>
      </header>
      {/* Modals */}
      <Modal open={showLogin} onClose={() => { setShowLogin(false); setLoginError(""); setLoginSuccess(""); setGoogleLoginDisabled(false); }}>
        <h2 className="text-2xl font-bold text-palette-black mb-6 text-center">Login</h2>
        <form className="space-y-4 mb-4" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 rounded-lg bg-palette-gray text-palette-black border border-palette-blue focus:outline-none focus:ring-2 focus:ring-palette-green placeholder-palette-grayDark"
            required
            value={loginEmail}
            onChange={e => setLoginEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 rounded-lg bg-palette-gray text-palette-black border border-palette-blue focus:outline-none focus:ring-2 focus:ring-palette-green placeholder-palette-grayDark"
            required
            value={loginPassword}
            onChange={e => setLoginPassword(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-palette-green text-palette-black font-semibold py-2 rounded-lg shadow hover:bg-palette-yellow transition"
            disabled={loginLoading}
          >
            {loginLoading ? "Logging in..." : "Login"}
          </button>
          {loginError && <div className="text-red-400 text-sm text-center mt-2">{loginError}</div>}
          {loginSuccess && <div className="text-green-600 text-sm text-center mt-2">{loginSuccess}</div>}
        </form>
        {/* <div className="flex items-center my-2">
          <div className="flex-grow h-px bg-palette-cyan" />
          <span className="mx-2 text-black/70 text-sm">or</span>
          <div className="flex-grow h-px bg-palette-cyan" />
        </div> */}
      </Modal>
      <Modal open={showSignup} onClose={() => { setShowSignup(false); setSignupError(""); setSignupSuccess(""); setGoogleSignupDisabled(false); }}>
        <h2 className="text-2xl font-bold text-palette-black mb-6 text-center">Sign Up</h2>
        <form className="space-y-4 mb-4" onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Username"
            className="w-full px-4 py-2 rounded-lg bg-palette-gray text-palette-black border border-palette-blue focus:outline-none focus:ring-2 focus:ring-palette-green placeholder-palette-grayDark"
            required
            value={signupUsername}
            onChange={e => setSignupUsername(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 rounded-lg bg-palette-gray text-palette-black border border-palette-blue focus:outline-none focus:ring-2 focus:ring-palette-green placeholder-palette-grayDark"
            required
            value={signupEmail}
            onChange={e => setSignupEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 rounded-lg bg-palette-gray text-palette-black border border-palette-blue focus:outline-none focus:ring-2 focus:ring-palette-green placeholder-palette-grayDark"
            required
            value={signupPassword}
            onChange={e => setSignupPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full px-4 py-2 rounded-lg bg-palette-gray text-palette-black border border-palette-blue focus:outline-none focus:ring-2 focus:ring-palette-green placeholder-palette-grayDark"
            required
            value={signupConfirm}
            onChange={e => setSignupConfirm(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-palette-blue text-palette-black font-semibold py-2 rounded-lg shadow hover:bg-palette-yellow transition"
            disabled={signupLoading}
          >
            {signupLoading ? "Signing up..." : "Sign Up"}
          </button>
          {signupError && <div className="text-red-400 text-sm text-center mt-2">{signupError}</div>}
          {signupSuccess && <div className="text-green-600 text-sm text-center mt-2">{signupSuccess}</div>}
        </form>
        {/* <div className="flex items-center my-2">
          <div className="flex-grow h-px bg-palette-cyan" />
          <span className="mx-2 text-black/70 text-sm">or</span>
          <div className="flex-grow h-px bg-palette-cyan" />
        </div> */}
      </Modal>
      {/* Hero Section */}
      <section className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-between py-6 md:py-12 gap-8 md:gap-16 bg-transparent">
        {/* Left: Text and Actions */}
        <div className="flex-1 w-full max-w-full md:max-w-[650px] mb-8 md:mb-0">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-extrabold text-palette-black mb-4 md:mb-6 leading-tight">
            UnifyCall <br />
            with one-click
          </h1>
          <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-5xl font-extrabold text-palette-blue mb-2 md:mb-4 leading-tight">
            Seamless Video Calling for Everyone
          </h3>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-palette-black mb-4 md:mb-8">
            Experience effortless, playful video meetings—connect face-to-face, anytime, anywhere.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-6 md:mb-8 w-full">
            <button className="bg-palette-yellow text-palette-black px-4 py-2 md:px-6 md:py-3 rounded-lg font-semibold shadow transition flex items-center gap-2 w-full sm:w-auto border border-palette-grayDark hover:bg-palette-peach">
              Try for free <span className="ml-1">▶️</span>
            </button>
            <button className="flex items-center gap-2 border border-palette-blue text-palette-blue px-4 py-2 md:px-6 md:py-3 rounded-lg font-semibold hover:bg-palette-green transition w-full sm:w-auto bg-white">
              Get a Demo
            </button>
          </div>
        </div>
        {/* Right: Image Slider */}
        <div className="flex-1 w-full max-w-full md:max-w-[650px] flex flex-col gap-4 md:gap-6 items-center md:items-end pr-0 md:pr-8">
          <div className="w-full flex justify-center md:justify-end">
            <div className="relative flex items-center justify-center w-full h-48 sm:h-64 md:w-[500px] md:h-[350px] lg:w-[650px] lg:h-[500px] rounded-3xl bg-palette-blue shadow-xl mx-auto">
              <img
                src={landingAvatars[currentAvatar].src}
                alt={landingAvatars[currentAvatar].title}
                className="rounded-3xl w-full h-full object-contain transition-all duration-700 bg-white border-4 border-palette-yellow shadow-lg mx-auto"
              />
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-palette-grayLight/90 px-2 py-0.5 rounded-lg shadow text-palette-black font-medium text-xs md:text-sm text-center">
                {landingAvatars[currentAvatar].title}
              </div>
              {/* Slider dots */}
              <div className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {landingAvatars.map((_, idx) => (
                  <button
                    key={idx}
                    className={`w-2 h-2 md:w-3 md:h-3 rounded-full border border-white ${currentAvatar === idx ? 'bg-palette-cyan' : 'bg-white/60'}`}
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
      <section className="w-full max-w-6xl px-4 sm:px-8 py-8 flex flex-col items-center">
        <span className="text-black mb-4">Trusted by teams and professionals worldwide.</span>
        <div className="flex flex-wrap gap-8 justify-center items-center">
          <span className="text-black font-bold text-xl">stripe</span>
          <span className="text-black font-bold text-xl">loom</span>
          <span className="text-black font-bold text-xl">WhatsApp</span>
          <span className="text-black font-bold text-xl">YouTube</span>
          <span className="text-black font-bold text-xl">zoom</span>
        </div>
      </section>
      {/* Features Section */}
      <section className="w-full max-w-6xl px-4 sm:px-8 py-12">
        <h2 className="text-3xl font-extrabold text-palette-black mb-6">Flexible, Powerful Video Calling</h2>
        <p className="text-lg text-palette-black mb-4">Virtual communication is made easier and more efficient with our platform's innovative video call features. Have seamless face-to-face conversations and collaborate in real time.</p>
      </section>
    </div>
  );
}

export default Landing; 