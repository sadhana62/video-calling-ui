import React, { useState } from "react";

function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-palette-pink rounded-xl shadow-lg p-8 w-full max-w-sm relative">
        <button
          className="absolute top-2 right-2 text-white text-2xl hover:text-palette-lime"
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

  // Handle login submit
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");
    setLoginSuccess("");
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      setLoginSuccess(data.message);
      setLoginEmail("");
      setLoginPassword("");
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
      const res = await fetch("/api/signup", {
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
      console.log(data);
      if (!res.ok) throw new Error(data.message || "Signup failed");
      setSignupSuccess(data.message);
      setSignupUsername("");
      setSignupEmail("");
      setSignupPassword("");
      setSignupConfirm("");
    } catch (err) {
      setSignupError(err.message);
    } finally {
      setSignupLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-palette-pink flex flex-col items-center">
      {/* Header */}
      <header className="w-full flex justify-between items-center px-8 py-6 bg-palette-pink shadow-sm">
        <div className="flex items-center gap-2">
          {/* <span className="font-extrabold text-2xl text-palette-lime">Tech.xyz</span> */}
        </div>
        <nav className="hidden md:flex gap-8 text-white font-medium">
          <a href="#" className="hover:text-palette-lime">How it works</a>
          <a href="#" className="hover:text-palette-lime">Features</a>
          <a href="#" className="hover:text-palette-lime">Solutions</a>
          <a href="#" className="hover:text-palette-lime">Pricing</a>
        </nav>
        <div className="flex gap-4">
          <button
            className="px-4 py-2 rounded-lg text-white font-semibold hover:bg-palette-lime"
            onClick={() => setShowLogin(true)}
          >
            Login
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-palette-cyan text-white font-semibold hover:bg-palette-lime"
            onClick={() => setShowSignup(true)}
          >
            Sign up
          </button>
        </div>
      </header>
      {/* Modals */}
      <Modal open={showLogin} onClose={() => { setShowLogin(false); setLoginError(""); setLoginSuccess(""); setGoogleLoginDisabled(false); }}>
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Login</h2>
        <form className="space-y-4 mb-4" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 rounded-lg bg-palette-pink text-white border border-palette-cyan focus:outline-none focus:ring-2 focus:ring-palette-lime placeholder-white/80"
            required
            value={loginEmail}
            onChange={e => setLoginEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 rounded-lg bg-palette-pink text-white border border-palette-cyan focus:outline-none focus:ring-2 focus:ring-palette-lime placeholder-white/80"
            required
            value={loginPassword}
            onChange={e => setLoginPassword(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-palette-cyan text-white font-semibold py-2 rounded-lg shadow hover:bg-palette-lime transition"
            disabled={loginLoading}
          >
            {loginLoading ? "Logging in..." : "Login"}
          </button>
          {loginError && <div className="text-red-300 text-sm text-center mt-2">{loginError}</div>}
          {loginSuccess && <div className="text-green-300 text-sm text-center mt-2">{loginSuccess}</div>}
        </form>
        <div className="flex items-center my-2">
          <div className="flex-grow h-px bg-palette-cyan" />
          <span className="mx-2 text-white/70 text-sm">or</span>
          <div className="flex-grow h-px bg-palette-cyan" />
        </div>
        <button
          className={`w-full flex items-center justify-center gap-2 bg-white text-palette-pink font-semibold py-3 rounded-lg shadow transition mb-2 ${googleLoginDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-palette-lime'}`}
          disabled={googleLoginDisabled}
          onClick={() => setGoogleLoginDisabled(true)}
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-6 h-6" />
          {googleLoginDisabled ? 'Coming soon!' : 'Login with Google'}
        </button>
      </Modal>
      <Modal open={showSignup} onClose={() => { setShowSignup(false); setSignupError(""); setSignupSuccess(""); setGoogleSignupDisabled(false); }}>
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Sign Up</h2>
        <form className="space-y-4 mb-4" onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Username"
            className="w-full px-4 py-2 rounded-lg bg-palette-pink text-white border border-palette-cyan focus:outline-none focus:ring-2 focus:ring-palette-lime placeholder-white/80"
            required
            value={signupUsername}
            onChange={e => setSignupUsername(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 rounded-lg bg-palette-pink text-white border border-palette-cyan focus:outline-none focus:ring-2 focus:ring-palette-lime placeholder-white/80"
            required
            value={signupEmail}
            onChange={e => setSignupEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 rounded-lg bg-palette-pink text-white border border-palette-cyan focus:outline-none focus:ring-2 focus:ring-palette-lime placeholder-white/80"
            required
            value={signupPassword}
            onChange={e => setSignupPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full px-4 py-2 rounded-lg bg-palette-pink text-white border border-palette-cyan focus:outline-none focus:ring-2 focus:ring-palette-lime placeholder-white/80"
            required
            value={signupConfirm}
            onChange={e => setSignupConfirm(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-palette-cyan text-white font-semibold py-2 rounded-lg shadow hover:bg-palette-lime transition"
            disabled={signupLoading}
          >
            {signupLoading ? "Signing up..." : "Sign Up"}
          </button>
          {signupError && <div className="text-red-300 text-sm text-center mt-2">{signupError}</div>}
          {signupSuccess && <div className="text-green-300 text-sm text-center mt-2">{signupSuccess}</div>}
        </form>
        <div className="flex items-center my-2">
          <div className="flex-grow h-px bg-palette-cyan" />
          <span className="mx-2 text-white/70 text-sm">or</span>
          <div className="flex-grow h-px bg-palette-cyan" />
        </div>
        <button
          className={`w-full flex items-center justify-center gap-2 bg-white text-palette-pink font-semibold py-3 rounded-lg shadow transition mb-2 ${googleSignupDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-palette-lime'}`}
          disabled={googleSignupDisabled}
          onClick={() => setGoogleSignupDisabled(true)}
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-6 h-6" />
          {googleSignupDisabled ? 'Coming soon!' : 'Sign up with Google'}
        </button>
      </Modal>
      {/* Hero Section */}
      <section className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-between px-4 sm:px-8 py-12 gap-12 md:gap-20">
        {/* Left: Text and Actions */}
        <div className="flex-1 w-full max-w-xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
            UnifyCall <br />
            with one-click 
          </h1>
          <h3 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4 leading-tight"><span className="text-white">All Your Conversations, One Seamless Platform</span></h3>
          <p className="text-base sm:text-lg lg:text-xl text-white mb-8">
            Experience effortless voice, video, and messaging—connect your way, anytime, anywhere.
          </p>
          <div className="flex gap-4 mb-8">
            <button className="bg-palette-cyan text-white px-6 py-3 rounded-lg font-semibold shadow transition flex items-center gap-2">
              Try for free <span className="ml-1">▶️</span>
            </button>
            <button className="flex items-center gap-2 border border-palette-burgundy text-palette-burgundy px-6 py-3 rounded-lg font-semibold hover:bg-palette-lime transition">
              Get a Demo
            </button>
          </div>
          <ul className="text-white space-y-2 mb-8">
            <li className="flex items-center gap-2"><span className="text-white">✔️</span> Makes it easy to interact remotely.</li>
            <li className="flex items-center gap-2"><span className="text-white">✔️</span> Not limited by time, place, or reach.</li>
            <li className="flex items-center gap-2"><span className="text-white">✔️</span> Facilitate the exchange of information with others widely.</li>
          </ul>
        </div>
        {/* Right: Feature Cards Grid */}
        <div className="flex-1 flex flex-col gap-6 items-center w-full max-w-lg">
          <div className="grid grid-cols-3 gap-6 w-full">
            {/* Voice Call Feature */}
            <div className="bg-palette-cyan rounded-2xl shadow p-6 flex flex-col items-center">
              <div className="flex -space-x-2 mb-2">
                <span className="w-10 h-10 rounded-full bg-palette-burgundy text-white flex items-center justify-center font-bold text-lg border-2 border-white">A</span>
                <span className="w-10 h-10 rounded-full bg-palette-mint text-white flex items-center justify-center font-bold text-lg border-2 border-white">B</span>
                <span className="w-10 h-10 rounded-full bg-palette-blue text-white flex items-center justify-center font-bold text-lg border-2 border-white">C</span>
              </div>
              <div className="bg-palette-burgundy p-2 rounded-full mb-2 text-2xl text-white"><span role="img" aria-label="call">📞</span></div>
              <span className="font-semibold text-white">Voice Call</span>
              <span className="text-xs text-white">Crystal clear audio</span>
            </div>
            {/* Video Call Feature */}
            <div className="bg-palette-cyan rounded-2xl shadow p-6 flex flex-col items-center">
              <div className="flex -space-x-2 mb-2">
                <span className="w-10 h-10 rounded-full bg-palette-cyan text-white flex items-center justify-center font-bold text-lg border-2 border-white">👩</span>
                <span className="w-10 h-10 rounded-full bg-palette-lime text-white flex items-center justify-center font-bold text-lg border-2 border-white">🧑</span>
                <span className="w-10 h-10 rounded-full bg-palette-mint text-white flex items-center justify-center font-bold text-lg border-2 border-white">👨</span>
              </div>
              <div className="bg-palette-pink p-2 rounded-full mb-2 text-2xl text-white"><span role="img" aria-label="video">🎥</span></div>
              <span className="font-semibold text-white">Video Call</span>
              <span className="text-xs text-white">HD video meetings</span>
            </div>
            {/* Chat Feature */}
            <div className="bg-palette-cyan rounded-2xl shadow p-6 flex flex-col items-center">
              <div className="flex -space-x-2 mb-2">
                <span className="w-10 h-10 rounded-full bg-palette-lime text-white flex items-center justify-center font-bold text-lg border-2 border-white">D</span>
                <span className="w-10 h-10 rounded-full bg-palette-cyan text-white flex items-center justify-center font-bold text-lg border-2 border-white">E</span>
                <span className="w-10 h-10 rounded-full bg-palette-blue text-white flex items-center justify-center font-bold text-lg border-2 border-white">F</span>
              </div>
              <div className="bg-palette-lime p-2 rounded-full mb-2 text-2xl text-white"><span role="img" aria-label="chat">💬</span></div>
              <span className="font-semibold text-white">Chat</span>
              <span className="text-xs text-white">Instant messaging</span>
            </div>
          </div>
          <div className="flex gap-4 mt-4">
            <button className="bg-palette-cyan hover:bg-palette-lime text-white p-4 rounded-full shadow-lg text-xl cursor-pointer" title="Start Call"><span role="img" aria-label="call">📞</span></button>
            <button className="bg-palette-mint hover:bg-palette-lime text-palette-mauve p-4 rounded-full shadow-lg text-xl cursor-pointer" title="Start Video Call"><span role="img" aria-label="video">🎥</span></button>
            <button className="bg-palette-cyan hover:bg-palette-lime text-white p-4 rounded-full shadow-lg text-xl cursor-pointer" title="Open Chat"><span role="img" aria-label="chat">💬</span></button>
          </div>
        </div>
      </section>
      {/* Trusted by Section */}
      <section className="w-full max-w-6xl px-4 sm:px-8 py-8 flex flex-col items-center">
        <span className="text-white mb-4">Trusted by over a lot of companies.</span>
        <div className="flex flex-wrap gap-8 justify-center items-center">
          <span className="text-white font-bold text-xl">stripe</span>
          <span className="text-white font-bold text-xl">loom</span>
          <span className="text-white font-bold text-xl">WhatsApp</span>
          <span className="text-white font-bold text-xl">YouTube</span>
          <span className="text-white font-bold text-xl">zoom</span>
        </div>
      </section>
      {/* Features Section */}
      <section className="w-full max-w-6xl px-4 sm:px-8 py-12">
        <h2 className="text-3xl font-extrabold text-white mb-6">More Flexible and Helpful for Users</h2>
        <p className="text-lg text-white mb-4">Virtual communication is made easier and more efficient with our platform's innovative features. Have seamless conversations, share files, and collaborate in real time.</p>
      </section>
    </div>
  );
}

export default Landing; 