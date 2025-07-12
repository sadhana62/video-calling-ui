import React, { useEffect, useRef, useState } from 'react';

function generateRoomId() {
  return 'room-' + Math.random().toString(36).substr(2, 8);
}

function JoinMeetingPreview({ userId: initialUserId, onJoin }) {
  const [camOn, setCamOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [userId, setUserId] = useState(initialUserId || 'user');
  const [roomId, setRoomId] = useState(generateRoomId());
  const [mediaStream, setMediaStream] = useState(null);
  const videoRef = useRef();

  useEffect(() => {
    if (camOn || micOn) {
      navigator.mediaDevices.getUserMedia({ video: camOn, audio: micOn })
        .then(stream => {
          setMediaStream(stream);
          if (videoRef.current && camOn) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(() => setMediaStream(null));
    } else {
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
        setMediaStream(null);
      }
    }
    // Cleanup on unmount
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
    };
    // eslint-disable-next-line
  }, [camOn, micOn]);

  useEffect(() => {
    if (videoRef.current && camOn && mediaStream) {
      videoRef.current.srcObject = mediaStream;
    } else if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, [camOn, mediaStream]);

  return (
    <div className="min-h-screen bg-[#00B5D9] flex flex-col items-center justify-center px-4 py-8">
      <div className="bg-white rounded-2xl p-8 flex flex-col items-center w-full max-w-md">
        <h2 className="text-2xl font-bold text-[#00B5D9] mb-4">Join Meeting</h2>
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
            onClick={() => setMicOn(m => !m)}
            className={`px-4 py-2 rounded-full text-xl font-bold ${micOn ? 'bg-[#00B5D9] text-white' : 'bg-gray-300 text-gray-600'}`}
            aria-label="Toggle microphone"
          >
            {micOn ? '🎤' : '🔇'}
          </button>
          <button
            onClick={() => setCamOn(c => !c)}
            className={`px-4 py-2 rounded-full text-xl font-bold ${camOn ? 'bg-[#00B5D9] text-white' : 'bg-gray-300 text-gray-600'}`}
            aria-label="Toggle camera"
          >
            {camOn ? '📷' : '🚫'}
          </button>
        </div>
        <div className="w-full flex flex-col gap-2 mb-4">
          <label className="text-[#00B5D9] font-semibold">Your Name</label>
          <input
            className="rounded-full px-4 py-2 border border-[#00B5D9] focus:outline-none"
            value={userId}
            onChange={e => setUserId(e.target.value)}
            placeholder="Enter your name"
          />
        </div>
        <div className="w-full flex flex-col gap-2 mb-6">
          <label className="text-[#00B5D9] font-semibold">Room ID</label>
          <input
            className="rounded-full px-4 py-2 border border-[#00B5D9] bg-gray-100 text-gray-600 cursor-not-allowed"
            value={roomId}
            readOnly
          />
        </div>
        <button
          className="w-full bg-[#00B5D9] text-white font-semibold py-3 rounded-full hover:bg-yellow-300 hover:text-black transition"
          onClick={() => onJoin(roomId, userId, camOn, micOn)}
          disabled={!userId}
        >
          Join
        </button>
      </div>
    </div>
  );
}

export default JoinMeetingPreview; 