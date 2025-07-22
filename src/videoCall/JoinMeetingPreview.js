import React, { useEffect, useRef, useState } from 'react';

function generateRoomId() {
  return 'room-' + Math.random().toString(36).substr(2, 8);
}

function JoinMeetingPreview({ userId: initialUserId, onJoin, roomId: propRoomId }) {
  const [camOn, setCamOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [userId, setUserId] = useState(initialUserId || 'user');
  const [roomId, setRoomId] = useState(propRoomId || generateRoomId());
  const [mediaStream, setMediaStream] = useState(null);
  const [devices, setDevices] = useState({ audio: [], video: [] });
  const [selectedAudio, setSelectedAudio] = useState('');
  const [selectedVideo, setSelectedVideo] = useState('');
  const videoRef = useRef();

  // Get devices list
  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(deviceInfos => {
      const audio = deviceInfos.filter(d => d.kind === 'audioinput');
      const video = deviceInfos.filter(d => d.kind === 'videoinput');
      setDevices({ audio, video });

      // Set defaults if not already set
      if (!selectedAudio && audio.length > 0) setSelectedAudio(audio[0].deviceId);
      if (!selectedVideo && video.length > 0) setSelectedVideo(video[0].deviceId);
    });
  }, []);

  // Get media stream when device or toggles change
  useEffect(() => {
    if (camOn || micOn) {
      navigator.mediaDevices.getUserMedia({
        video: camOn ? { deviceId: selectedVideo ? { exact: selectedVideo } : undefined } : false,
        audio: micOn ? { deviceId: selectedAudio ? { exact: selectedAudio } : undefined } : false,
      })
        .then(stream => {
          setMediaStream(stream);
          if (videoRef.current) videoRef.current.srcObject = stream;
        })
        .catch(() => {
          setMediaStream(null);
          if (videoRef.current) videoRef.current.srcObject = null;
        });
    } else {
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
        setMediaStream(null);
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }

    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
    // eslint-disable-next-line
  }, [camOn, micOn, selectedAudio, selectedVideo]);

  return (
    <div className="min-h-screen bg-[#00B5D9] flex flex-col items-center justify-center px-2 sm:px-4 py-4 sm:py-8">
      <div className="bg-white rounded-2xl p-4 sm:p-8 flex flex-col items-center w-full max-w-xs sm:max-w-md">
        <h2 className="text-xl sm:text-2xl font-bold text-[#00B5D9] mb-3 sm:mb-4">Join Meeting</h2>

        <div className="w-44 h-28 sm:w-64 sm:h-40 bg-black rounded-xl flex items-center justify-center mb-3 sm:mb-4 overflow-hidden">
          {camOn && mediaStream ? (
            <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover rounded-xl" />
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-full text-white text-3xl sm:text-5xl bg-gray-700 rounded-xl">
              <span role="img" aria-label="avatar">👤</span>
              <span className="text-xs sm:text-base mt-2">Camera off</span>
            </div>
          )}
        </div>

        <div className="flex gap-2 sm:gap-4 items-center mb-4 sm:mb-6">
          <button
            onClick={() => setMicOn(m => !m)}
            className={`px-3 sm:px-4 py-2 rounded-full text-lg sm:text-xl font-bold ${micOn ? 'bg-[#00B5D9] text-white' : 'bg-gray-300 text-gray-600'}`}
            aria-label="Toggle microphone"
          >
            {micOn ? '🎤' : '🔇'}
          </button>
          <button
            onClick={() => setCamOn(c => !c)}
            className={`px-3 sm:px-4 py-2 rounded-full text-lg sm:text-xl font-bold ${camOn ? '📷' : '🚫'} ${camOn ? 'bg-[#00B5D9] text-white' : 'bg-gray-300 text-gray-600'}`}
            aria-label="Toggle camera"
          >
            {camOn ? '📷' : '🚫'}
          </button>
          <button
            onClick={() => setShowSettings(prev => !prev)}
            className="text-xl sm:text-2xl text-gray-600 hover:text-[#00B5D9]"
            aria-label="Device settings"
          >
            ⚙️
          </button>
        </div>

        {showSettings && (
          <div className="w-full mb-4 space-y-3">
            <div>
              <label className="block text-sm sm:text-base font-medium text-[#00B5D9] mb-1">Select Microphone</label>
              <select
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-xs sm:text-sm"
                value={selectedAudio}
                onChange={e => setSelectedAudio(e.target.value)}
              >
                {devices.audio.map(device => (
                  <option key={device.deviceId} value={device.deviceId}>
                    {device.label || 'Microphone'}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm sm:text-base font-medium text-[#00B5D9] mb-1">Select Camera</label>
              <select
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-xs sm:text-sm"
                value={selectedVideo}
                onChange={e => setSelectedVideo(e.target.value)}
              >
                {devices.video.map(device => (
                  <option key={device.deviceId} value={device.deviceId}>
                    {device.label || 'Camera'}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        <div className="w-full flex flex-col gap-2 mb-2 sm:mb-4">
          <label className="text-[#00B5D9] font-semibold text-sm sm:text-base">Your Name</label>
          <input
            className="rounded-full px-3 sm:px-4 py-2 border border-[#00B5D9] focus:outline-none text-xs sm:text-base"
            value={userId}
            onChange={e => setUserId(e.target.value)}
            placeholder="Enter your name"
          />
        </div>
        <div className="w-full flex flex-col gap-2 mb-4">
          <label className="text-[#00B5D9] font-semibold text-sm sm:text-base">Room ID</label>
          <input
            className="rounded-full px-3 sm:px-4 py-2 border border-[#00B5D9] bg-gray-100 text-gray-600 cursor-not-allowed text-xs sm:text-base"
            value={roomId}
            readOnly
          />
        </div>
        <button
          className="w-full bg-[#00B5D9] text-white font-semibold py-2 sm:py-3 rounded-full hover:bg-yellow-300 hover:text-black transition text-xs sm:text-base"
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
