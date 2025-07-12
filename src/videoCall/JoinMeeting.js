import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaDesktop, FaComments } from 'react-icons/fa';

const socket = io(process.env.REACT_APP_API_URL); // Your backend

function Room({ roomId, userId, camOn = true, micOn = true }) {
  const [chat, setChat] = useState([]);
  const [msg, setMsg] = useState('');
  const [peers, setPeers] = useState({});
  const [streams, setStreams] = useState({});
  const localVideo = useRef();
  const localStream = useRef();
  const [isCamOn, setIsCamOn] = useState(camOn);
  const [isMicOn, setIsMicOn] = useState(micOn);
  const [showChat, setShowChat] = useState(false);

  // --- 1. Get local media on mount ---
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: camOn, audio: micOn }).then(stream => {
      localStream.current = stream;
      if (localVideo.current) localVideo.current.srcObject = stream;
      socket.emit('join-room', roomId, userId);
    });
  }, [roomId, userId, camOn, micOn]);

  // --- 2. Handle signaling and peer connections ---
  useEffect(() => {
    const peerConnections = {};

    // Helper: create a new peer connection
    const createPeer = (peerId, initiator) => {
      const pc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
      localStream.current.getTracks().forEach(track => pc.addTrack(track, localStream.current));

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('signal', { to: peerId, from: userId, type: 'ice-candidate', candidate: event.candidate });
        }
      };

      pc.ontrack = (event) => {
        setStreams(prev => ({ ...prev, [peerId]: event.streams[0] }));
      };

      if (initiator) {
        pc.onnegotiationneeded = async () => {
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          socket.emit('signal', { to: peerId, from: userId, type: 'offer', offer });
        };
      }

      peerConnections[peerId] = pc;
      setPeers(prev => ({ ...prev, [peerId]: pc }));
    };

    // When a new user joins, create a peer connection
    socket.on('user-joined', (peerId) => {
      if (peerId !== userId && !peerConnections[peerId]) {
        createPeer(peerId, true);
      }
    });

    // Handle incoming signals
    socket.on('signal', async (data) => {
      const { from, type, offer, answer, candidate } = data;
      if (from === userId) return;
      let pc = peerConnections[from];
      if (!pc) {
        createPeer(from, false);
        pc = peerConnections[from];
      }
      if (type === 'offer') {
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const ans = await pc.createAnswer();
        await pc.setLocalDescription(ans);
        socket.emit('signal', { to: from, from: userId, type: 'answer', answer: ans });
      } else if (type === 'answer') {
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
      } else if (type === 'ice-candidate') {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (e) {}
      }
    });

    // Clean up on leave
    return () => {
      Object.values(peerConnections).forEach(pc => pc.close());
      socket.disconnect();
    };
    // eslint-disable-next-line
  }, [roomId, userId]);

  // --- 3. Chat ---
  useEffect(() => {
    socket.on('chat-message', (data) => setChat((prev) => [...prev, data]));
    return () => socket.off('chat-message');
  }, []);

  const sendMessage = () => {
    socket.emit('chat-message', msg);
    setMsg('');
  };

  // --- 4. Screen Share ---
  const shareScreen = async () => {
    const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
    const videoTrack = stream.getVideoTracks()[0];
    Object.values(peers).forEach(pc => {
      const sender = pc.getSenders().find(s => s.track.kind === 'video');
      if (sender) sender.replaceTrack(videoTrack);
    });
    // When screen sharing ends, revert to camera
    videoTrack.onended = async () => {
      const camStream = await navigator.mediaDevices.getUserMedia({ video: true });
      Object.values(peers).forEach(pc => {
        const sender = pc.getSenders().find(s => s.track.kind === 'video');
        if (sender) sender.replaceTrack(camStream.getVideoTracks()[0]);
      });
      if (localVideo.current) localVideo.current.srcObject = camStream;
      localStream.current = camStream;
    };
    if (localVideo.current) localVideo.current.srcObject = stream;
    localStream.current = stream;
  };

  // Toggle camera
  const handleToggleCamera = () => {
    if (!localStream.current) return;
    const videoTrack = localStream.current.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !isCamOn;
      setIsCamOn(!isCamOn);
    }
  };

  // Toggle microphone
  const handleToggleMic = () => {
    if (!localStream.current) return;
    const audioTrack = localStream.current.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !isMicOn;
      setIsMicOn(!isMicOn);
    }
  };

  // --- 5. Themed UI ---
  return (
    <div className="min-h-screen bg-[#222] flex flex-col p-4">
      {/* Top bar */}
      <div className="bg-[#333] text-white rounded-lg px-4 py-2 flex items-center mb-2" style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="avatar" className="w-8 h-8 rounded-full mr-2" />
        <span className="font-semibold">Fathima is presenting</span>
      </div>
      {/* Main content */}
      <div className="flex flex-1 gap-4" style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        {/* Main video */}
        <div className="flex-1 bg-black rounded-xl flex items-center justify-center relative" style={{ minHeight: 400 }}>
          <video ref={localVideo} autoPlay muted playsInline className="w-full h-full object-cover rounded-xl" style={{ maxHeight: 500 }} />
          <div className="absolute bottom-4 left-4 text-white text-lg font-semibold drop-shadow">{userId} (You)</div>
        </div>
        {/* Side panel for participants */}
        <div className="w-72 flex flex-col gap-4">
          {Object.entries(streams).length === 0 && (
            <div className="bg-[#444] rounded-xl h-full flex flex-col items-center justify-center text-white opacity-60">
              <span>No other participants</span>
            </div>
          )}
          {Object.entries(streams).map(([peerId, stream], idx) => (
            <div key={peerId} className="relative bg-black rounded-xl overflow-hidden flex items-center justify-center" style={{ height: 90 }}>
              <video
                autoPlay
                playsInline
                className="w-full h-full object-cover"
                ref={el => { if (el) el.srcObject = stream; }}
              />
              <div className="absolute bottom-2 left-2 text-white text-base font-semibold drop-shadow">{peerId}</div>
            </div>
          ))}
        </div>
      </div>
      {/* Bottom bar */}
      <div className="bg-[#333] rounded-lg px-8 py-4 flex items-center justify-between mt-4" style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        <div className="text-white font-semibold text-lg">Class meeting</div>
        <div className="flex gap-6">
          <button onClick={handleToggleMic} className={`rounded-full p-3 text-2xl ${isMicOn ? 'bg-[#444] text-white' : 'bg-red-600 text-white'}`} title="Toggle Microphone">
            {isMicOn ? <FaMicrophone /> : <FaMicrophoneSlash />}
          </button>
          <button onClick={handleToggleCamera} className={`rounded-full p-3 text-2xl ${isCamOn ? 'bg-[#444] text-white' : 'bg-red-600 text-white'}`} title="Toggle Camera">
            {isCamOn ? <FaVideo /> : <FaVideoSlash />}
          </button>
          <button onClick={shareScreen} className="rounded-full p-3 text-2xl bg-[#444] text-white" title="Share Screen">
            <FaDesktop />
          </button>
          <button onClick={() => setShowChat(s => !s)} className={`rounded-full p-3 text-2xl ${showChat ? 'bg-yellow-400 text-black' : 'bg-[#444] text-white'}`} title="Toggle Chat">
            <FaComments />
          </button>
        </div>
      </div>
      {/* Chat panel (toggle) */}
      {showChat && (
        <div className="bg-[#222] rounded-xl p-4 mt-4" style={{ maxWidth: 500, margin: '0 auto', width: '100%' }}>
          <div className="w-full bg-[#333] rounded-xl p-4 mb-2" style={{ maxHeight: 200, overflowY: 'auto' }}>
            {chat.map((c, i) => (
              <div key={i} className="text-white"><b>{c.userId}:</b> {c.msg}</div>
            ))}
          </div>
          <div className="flex w-full gap-2">
            <input
              value={msg}
              onChange={e => setMsg(e.target.value)}
              className="flex-1 rounded-full px-4 py-2 border border-[#00B5D9] focus:outline-none"
              placeholder="Type a message..."
            />
            <button onClick={sendMessage} className="bg-[#00B5D9] text-white rounded-full px-6 py-2 font-semibold hover:bg-yellow-300 hover:text-black transition">Send</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Room; 