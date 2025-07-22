import React, { useState, useRef, useEffect } from 'react';
import ParticipantsModal from './ParticipantsModal';
import './VideoGrid.css'; // For custom styles (to be created if needed)

const getGridClass = (count) => {
  if (count === 1) return 'grid-1';
  if (count === 2) return 'grid-2';
  if (count === 3) return 'grid-3';
  if (count === 4) return 'grid-4';
  if (count === 5) return 'grid-5';
  return 'grid-6';
};

// Simple color hash for avatar backgrounds
function stringToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = `hsl(${hash % 360}, 70%, 60%)`;
  return color;
}

const VideoTile = ({ participant }) => {
  const videoRef = useRef();
  useEffect(() => {
    if (participant.videoOn && participant.stream && videoRef.current) {
      videoRef.current.srcObject = participant.stream;
    } else if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    // Clean up on unmount
    return () => {
      if (videoRef.current) videoRef.current.srcObject = null;
    };
  }, [participant.videoOn, participant.stream]);

  const initial = participant.name?.charAt(0)?.toUpperCase() || '?';
  const avatarColor = stringToColor(participant.name || 'user');

  return (
    <div className="video-tile">
      {participant.videoOn && participant.stream ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={participant.isSelf}
          className="w-full h-full object-cover rounded-xl"
          style={{ minHeight: 0, minWidth: 0 }}
        />
      ) : (
        <div className="video-placeholder video-off flex items-center justify-center" style={{background: avatarColor}}>
          <span style={{color: '#fff', fontSize: '2.5rem', fontWeight: 700}}>{initial}</span>
        </div>
      )}
      <div className="participant-info">
        <span>{participant.name}</span>
        <span className={`mic-status${participant.micOn ? '' : ' off'}`}>{participant.micOn ? '🎤' : '🔇'}</span>
        <span className={`video-status${participant.videoOn ? '' : ' off'}`}>{participant.videoOn ? '📹' : '📷'}</span>
      </div>
    </div>
  );
};

const VideoGrid = ({ participants }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const maxTiles = 6;
  const visibleParticipants = participants.slice(0, maxTiles);
  const extraCount = participants.length - maxTiles;

  return (
    <div className={`video-grid ${getGridClass(visibleParticipants.length)}`}>
      {visibleParticipants.map((p, idx) => (
        <VideoTile key={p.id} participant={p} />
      ))}
      {extraCount > 0 && (
        <div className="video-tile more-tile" onClick={() => setModalOpen(true)}>
          <div className="more-participants">+{extraCount} more</div>
        </div>
      )}
      {modalOpen && (
        <ParticipantsModal participants={participants} onClose={() => setModalOpen(false)} />
      )}
    </div>
  );
};

export default VideoGrid; 