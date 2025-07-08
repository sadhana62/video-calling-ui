import React, { useState } from "react";

import JoinMeeting from "./videoCall/JoinMeeting";

function UserDashboard({ user, onLogout }) {
  return <JoinMeeting user={user} onBack={onLogout} />;
}

export default UserDashboard; 