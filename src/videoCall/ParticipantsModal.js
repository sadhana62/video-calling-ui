import React from 'react';
import './ParticipantsModal.css'; // For custom styles (to be created if needed)

const ParticipantsModal = ({ participants, onClose }) => (
  <div className="modal-overlay">
    <div className="modal-content">
      <button className="close-btn" onClick={onClose}>×</button>
      <h2>All Participants</h2>
      <ul className="participants-list">
        {participants.map((p) => (
          <li key={p.id} className="participant-row">
            <span>{p.name}</span>
            <span className={`mic-status${p.micOn ? '' : ' off'}`}>{p.micOn ? '🎤' : '🔇'}</span>
            <span className={`video-status${p.videoOn ? '' : ' off'}`}>{p.videoOn ? '📹' : '📷'}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export default ParticipantsModal; 