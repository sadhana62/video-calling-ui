import React from "react";

const avatars = [
  "https://randomuser.me/api/portraits/men/32.jpg",
  "https://randomuser.me/api/portraits/women/44.jpg",
  "https://randomuser.me/api/portraits/men/45.jpg",
  "https://randomuser.me/api/portraits/women/68.jpg",
  "https://randomuser.me/api/portraits/men/65.jpg",
  "https://randomuser.me/api/portraits/women/65.jpg",
];

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
      <div className="w-full max-w-[1200px] flex flex-col md:flex-row items-center justify-between px-4 sm:px-8 py-10 sm:py-16 gap-16 md:gap-24">
        {/* Left: Text and Actions */}
        <div className="flex-1 w-full max-w-2xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
            Uniting the world,<br />
            <span className="text-blue-700">one video call at a time</span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-8">
            Experience the future of communication with ClearLink – where crystal-clear video conferencing meets unparalleled simplicity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <button className="bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-blue-800 transition w-full sm:w-auto">Start your free trial</button>
            <button className="flex items-center gap-2 border border-blue-700 text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition w-full sm:w-auto justify-center">
              <span role="img" aria-label="AI">🤖</span> Discover AI assistant
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {avatars.slice(0, 4).map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt="user avatar"
                  className="w-9 h-9 rounded-full border-2 border-white shadow -ml-1 first:ml-0"
                />
              ))}
            </div>
            <div className="flex items-center gap-1 ml-2">
              <span className="text-yellow-400 text-lg">★</span>
              <span className="font-bold text-gray-800">5.0</span>
              <span className="text-gray-500 text-sm">from 3,000+ reviews</span>
            </div>
          </div>
        </div>
        {/* Right: Video Call Card */}
        <div className="flex-1 flex justify-center w-full">
          <div className="bg-white rounded-3xl shadow-xl p-4 sm:p-8 flex flex-col items-center w-full max-w-md md:max-w-lg lg:max-w-xl">
            <div className="grid grid-cols-3 gap-4 sm:gap-6 mb-6 w-full">
              {avatars.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt="avatar"
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover border-2 border-gray-200 mx-auto"
                />
              ))}
            </div>
            <div className="flex justify-center gap-2 sm:gap-3 mt-2 flex-wrap w-full">
              <button className="bg-blue-100 p-2 sm:p-3 rounded-full hover:bg-blue-200">
                <span role="img" aria-label="mic">🎤</span>
              </button>
              <button className="bg-blue-100 p-2 sm:p-3 rounded-full hover:bg-blue-200">
                <span role="img" aria-label="video">🎥</span>
              </button>
              <button className="bg-blue-100 p-2 sm:p-3 rounded-full hover:bg-blue-200">
                <span role="img" aria-label="emoji">😊</span>
              </button>
              <button className="bg-blue-100 p-2 sm:p-3 rounded-full hover:bg-blue-200">
                <span role="img" aria-label="chat">💬</span>
              </button>
              <button className="bg-blue-100 p-2 sm:p-3 rounded-full hover:bg-blue-200">
                <span role="img" aria-label="settings">⚙️</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
