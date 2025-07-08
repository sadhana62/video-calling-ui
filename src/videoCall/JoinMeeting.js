import React, { useRef, useEffect, useState } from "react";

function JoinMeeting({ user, onBack }) {
  const videoRef = useRef(null);
  const [mediaStream, setMediaStream] = useState(null);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [joining, setJoining] = useState(false);
  const [joined, setJoined] = useState(false);

  // Get media stream only once on mount
  useEffect(() => {
    let stream;
    if (camOn || micOn) {
      navigator.mediaDevices.getUserMedia({ video: camOn, audio: micOn })
        .then(s => {
          stream = s;
          setMediaStream(s);
          if (videoRef.current && camOn) {
            videoRef.current.srcObject = s;
          }
        })
        .catch(() => setMediaStream(null));
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
    // eslint-disable-next-line
  }, []);

  // Update video/mic tracks when toggled
  useEffect(() => {
    if (!mediaStream) return;
    // Camera
    const videoTrack = mediaStream.getVideoTracks()[0];
    if (videoTrack) videoTrack.enabled = camOn;
    // Mic
    const audioTrack = mediaStream.getAudioTracks()[0];
    if (audioTrack) audioTrack.enabled = micOn;
    // Attach video
    if (videoRef.current && camOn) {
      videoRef.current.srcObject = mediaStream;
    }
    if (videoRef.current && !camOn) {
      videoRef.current.srcObject = null;
    }
  }, [camOn, micOn, mediaStream]);

  const handleToggleMic = () => setMicOn(m => !m);
  const handleToggleCam = () => setCamOn(c => !c);
  const handleJoin = () => {
    setJoining(true);
    setTimeout(() => {
      setJoined(true);
      setJoining(false);
    }, 1200);
  };

  if (joined) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <h2 className="text-3xl font-bold text-palette-cyan mb-4">Meeting Joined!</h2>
        <div className="text-lg text-gray-700 mb-8">(Meeting room UI goes here...)</div>
        <button className="px-6 py-2 bg-palette-cyan text-white rounded-lg font-semibold" onClick={onBack}>Back to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center w-full max-w-md">
        <h2 className="text-2xl font-bold text-palette-cyan mb-4">Ready to join?</h2>
        <div className="w-64 h-40 bg-black rounded-xl flex items-center justify-center mb-4 overflow-hidden">
          {camOn && mediaStream ? (
            <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover rounded-xl" />
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-full text-white text-5xl bg-gray-700 rounded-xl">
              <span role="img" aria-label="avatar">👤</span>
              <span className="text-base mt-2">Camera off</span>
            </div>
          )}
        </div>
        <div className="flex gap-4 mb-6">
          <button
            onClick={handleToggleMic}
            className={`px-4 py-2 rounded-full text-xl font-bold shadow ${micOn ? 'bg-palette-cyan text-white' : 'bg-gray-300 text-gray-600'}`}
            aria-label="Toggle microphone"
          >
            {micOn ? '🎤' : '🔇'}
          </button>
          <button
            onClick={handleToggleCam}
            className={`px-4 py-2 rounded-full text-xl font-bold shadow ${camOn ? 'bg-palette-cyan text-white' : 'bg-gray-300 text-gray-600'}`}
            aria-label="Toggle camera"
          >
            {camOn ? '📷' : '🚫'}
          </button>
        </div>
        <button
          onClick={handleJoin}
          disabled={joining}
          className="w-full bg-palette-cyan text-white font-semibold py-2 rounded-lg shadow hover:bg-palette-lime transition mb-2 disabled:opacity-60"
        >
          {joining ? 'Joining...' : 'Join now'}
        </button>
        <button
          onClick={onBack}
          className="w-full bg-gray-200 text-gray-700 font-semibold py-2 rounded-lg shadow hover:bg-gray-300 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default JoinMeeting; 