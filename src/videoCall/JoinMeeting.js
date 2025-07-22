import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaDesktop, FaComments } from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';
import VideoGrid from './VideoGrid';

const socket = io(process.env.REACT_APP_API_URL); // Your backend

function Room({ roomId, userId, camOn = true, micOn = true, username }) {
  const [chat, setChat] = useState([]);
  const [msg, setMsg] = useState('');
  const [peers, setPeers] = useState({});
  const [streams, setStreams] = useState({});
  const localVideo = useRef();
  const localStream = useRef();
  const [isCamOn, setIsCamOn] = useState(camOn);
  const [isMicOn, setIsMicOn] = useState(micOn);
  const [showChat, setShowChat] = useState(false);
  const displayName = username || userId;
  const [copySuccess, setCopySuccess] = useState(false);
  const navigate = useNavigate();

  const roomLink = `${window.location.origin}/room/${roomId}`;
  const handleCopyLink = () => {
    navigator.clipboard.writeText(roomLink);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  // --- 1. Get local media on mount ---
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: camOn, audio: true }).then(stream => {
      // Set audio track enabled/disabled based on micOn
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) audioTrack.enabled = micOn;
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
          console.log('Sending ICE candidate to', peerId, event.candidate);
          socket.emit('signal', { to: peerId, from: userId, type: 'ice-candidate', candidate: event.candidate });
        }
      };

      pc.ontrack = (event) => {
        console.log('Received remote track from', peerId, event.streams[0]);
        setStreams(prev => ({ ...prev, [peerId]: event.streams[0] }));
      };

      if (initiator) {
        pc.onnegotiationneeded = async () => {
          console.log('Negotiation needed for', peerId);
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          console.log('Created and set local offer for', peerId, offer);
          socket.emit('signal', { to: peerId, from: userId, type: 'offer', offer });
        };
      }

      peerConnections[peerId] = pc;
      setPeers(prev => ({ ...prev, [peerId]: pc }));
    };

    // When a new user joins, create a peer connection
    socket.on('user-joined', (peerId) => {
      console.log('New user joined:', peerId, 'in room', roomId);
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
        console.log('Received offer from', from, offer);
        if (pc.signalingState !== 'stable') {
          console.warn('Peer', from, 'not stable, signalingState:', pc.signalingState);
        }
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        console.log('Set remote offer for', from);
        const ans = await pc.createAnswer();
        await pc.setLocalDescription(ans);
        console.log('Created and set local answer for', from, ans);
        socket.emit('signal', { to: from, from: userId, type: 'answer', answer: ans });
      } else if (type === 'answer') {
        console.log('Received answer from', from, answer);
        if (pc.signalingState !== 'have-local-offer') {
          console.warn('Peer', from, 'not in have-local-offer state, signalingState:', pc.signalingState);
        }
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
        console.log('Set remote answer for', from);
      } else if (type === 'ice-candidate') {
        console.log('Received ICE candidate from', from, candidate);
        try {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
          console.log('Added ICE candidate from', from);
        } catch (e) {
          console.error('Error adding ICE candidate from', from, e);
        }
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
  const handleToggleCamera = async () => {
    if (!localStream.current) return;
    const videoTrack = localStream.current.getVideoTracks()[0];
    if (isCamOn && videoTrack) {
      // Stop the video track to turn off the camera light
      videoTrack.stop();
      setIsCamOn(false);
      // Optionally, remove the video track from peer connections
      Object.values(peers).forEach(pc => {
        const sender = pc.getSenders().find(s => s.track && s.track.kind === 'video');
        if (sender) sender.replaceTrack(null);
      });
      if (localVideo.current) localVideo.current.srcObject = null;
    } else if (!isCamOn) {
      // Reacquire the camera
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: isMicOn });
        localStream.current = stream;
        if (localVideo.current) localVideo.current.srcObject = stream;
        // Replace video track in peer connections
        Object.values(peers).forEach(pc => {
          const sender = pc.getSenders().find(s => s.track && s.track.kind === 'video');
          if (sender) sender.replaceTrack(stream.getVideoTracks()[0]);
        });
        setIsCamOn(true);
      } catch (e) {
        // Could not reacquire camera
      }
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

  // End/Exit room handler
  const handleEndCall = () => {
    // Disconnect socket
    socket.disconnect();
    // Stop all local media tracks
    if (localStream.current) {
      localStream.current.getTracks().forEach(track => track.stop());
    }
    // Redirect to home
    navigate('/');
  };

  // --- 5. Themed UI ---
  // Prepare participants array for VideoGrid
  const participants = [
    {
      id: userId,
      name: displayName + ' (You)',
      videoOn: isCamOn,
      micOn: isMicOn,
      stream: localStream.current || null,
      isSelf: true,
    },
    ...Object.entries(streams).map(([peerId, stream]) => ({
      id: peerId,
      name: peerId,
      videoOn: true, // You can replace with real status if available
      micOn: true,   // You can replace with real status if available
      stream,
      isSelf: false,
    }))
  ];
  return (
    <div className="min-h-screen bg-[#222] flex flex-col p-2 sm:p-4">
      {/* Top bar */}
      <div className="bg-[#333] text-white rounded-lg px-2 sm:px-4 py-2 flex items-center mb-2" style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="avatar" className="w-8 h-8 rounded-full mr-2" />
        <span className="font-semibold text-sm sm:text-base mr-4">{displayName} is presenting</span>
        <button
          onClick={handleCopyLink}
          className="ml-auto bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs sm:text-sm font-semibold transition"
        >
          Copy Room Link
        </button>
        {copySuccess && (
          <span className="ml-2 text-green-400 text-xs">Copied!</span>
        )}
      </div>
      {/* Main content: VideoGrid replaces old video/side panel */}
      <div className="flex-1 flex items-center justify-center" style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        <VideoGrid participants={participants} />
      </div>
      {/* Bottom bar */}
      <div className="bg-[#333] rounded-lg px-2 sm:px-8 py-3 sm:py-4 flex flex-col sm:flex-row items-center justify-between mt-4 gap-3 sm:gap-0" style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        <div className="text-white font-semibold text-base sm:text-lg mb-2 sm:mb-0">Class meeting</div>
        <div className="flex gap-3 sm:gap-6">
          <button onClick={handleToggleMic} className={`rounded-full p-2 sm:p-3 text-xl sm:text-2xl ${isMicOn ? 'bg-[#444] text-white' : 'bg-red-600 text-white'}`} title="Toggle Microphone">
            {isMicOn ? <FaMicrophone /> : <FaMicrophoneSlash />}
          </button>
          <button onClick={handleToggleCamera} className={`rounded-full p-2 sm:p-3 text-xl sm:text-2xl ${isCamOn ? 'bg-[#444] text-white' : 'bg-red-600 text-white'}`} title="Toggle Camera">
            {isCamOn ? <FaVideo /> : <FaVideoSlash />}
          </button>
          <button onClick={shareScreen} className="rounded-full p-2 sm:p-3 text-xl sm:text-2xl bg-[#444] text-white" title="Share Screen">
            <FaDesktop />
          </button>
          <button onClick={() => setShowChat(s => !s)} className={`rounded-full p-2 sm:p-3 text-xl sm:text-2xl ${showChat ? 'bg-yellow-400 text-black' : 'bg-[#444] text-white'}`} title="Toggle Chat">
            <FaComments />
          </button>
          {/* End/Exit button */}
          <button onClick={handleEndCall} className="rounded-full p-2 sm:p-3 text-xl sm:text-2xl bg-red-700 text-white hover:bg-red-800 transition" title="End Call">
            End
          </button>
        </div>
      </div>
      {/* Chat panel (toggle) */}
      {showChat && (
        <div className="bg-[#222] rounded-xl p-2 sm:p-4 mt-4" style={{ maxWidth: 500, margin: '0 auto', width: '100%' }}>
          <div className="w-full bg-[#333] rounded-xl p-2 sm:p-4 mb-2" style={{ maxHeight: 200, overflowY: 'auto' }}>
            {chat.map((c, i) => (
              <div key={i} className="text-white text-xs sm:text-base"><b>{c.userId}:</b> {c.msg}</div>
            ))}
          </div>
          <div className="flex w-full gap-2">
            <input
              value={msg}
              onChange={e => setMsg(e.target.value)}
              className="flex-1 rounded-full px-3 sm:px-4 py-2 border border-[#00B5D9] focus:outline-none text-xs sm:text-base"
              placeholder="Type a message..."
            />
            <button onClick={sendMessage} className="bg-[#00B5D9] text-white rounded-full px-4 sm:px-6 py-2 font-semibold hover:bg-yellow-300 hover:text-black transition text-xs sm:text-base">Send</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Room; 