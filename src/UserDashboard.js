import React, { useState } from "react";

import Room from "./videoCall/JoinMeeting";
import JoinMeeting from "./videoCall/JoinMeetingPreview";

function UserDashboard({ user, onLogout }) {
  const [joined, setJoined] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [userId, setUserId] = useState(user?.username || "user");
  const [camOn, setCamOn] = useState(true);
  const [micOn, setMicOn] = useState(true);

  const handleJoin = (room, username, cam, mic) => {
    setRoomId(room);
    setUserId(username);
    setCamOn(cam);
    setMicOn(mic);
    setJoined(true);
  };

  if (!joined) {
    return <JoinMeeting userId={userId} onJoin={handleJoin} />;
  }
  return <Room roomId={roomId} userId={userId} camOn={camOn} micOn={micOn} />;
}

export default UserDashboard; 