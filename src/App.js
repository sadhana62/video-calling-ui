import React, { useState } from "react";
import Landing from "./Landing";
import JoinMeetingPreview from "./videoCall/JoinMeetingPreview";
import Room from "./videoCall/JoinMeeting";
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';

function RoomJoinFlowWrapper() {
  const { roomId } = useParams();
  const [joined, setJoined] = useState(false);
  const [userId, setUserId] = useState("");
  const [camOn, setCamOn] = useState(true);
  const [micOn, setMicOn] = useState(true);

  const handleJoin = (room, username, cam, mic) => {
    setUserId(username);
    setCamOn(cam);
    setMicOn(mic);
    setJoined(true);
  };

  if (!joined) {
    return <JoinMeetingPreview roomId={roomId} onJoin={handleJoin} />;
  }
  return <Room roomId={roomId} userId={userId} camOn={camOn} micOn={micOn} />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/room/:roomId" element={<RoomJoinFlowWrapper />} />
      </Routes>
    </Router>
  );
}

export default App;
