//const API_URL = "https://liferpg-api-nx4m.onrender.com/api";
const API_URL = "http://localhost:5000/api";
export async function registerUser(userData) {
  console.log("REGISTER REQUEST:", userData);

  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  console.log("REGISTER RESPONSE:", response.status);

  const data = await response.json();

  console.log("REGISTER DATA:", data);

  if (!response.ok) {
    throw new Error(data.message || "Registration failed");
  }

  return data;
}

export async function loginUser(userData) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data;
}

export async function getQuests() {
  const response = await fetch(`${API_URL}/quests`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Could not load quests");
  }

  return data;
}

export async function createQuest(questData) {
  const response = await fetch(
    `${API_URL}/quests`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(questData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Could not create quest"
    );
  }

  return data;
}


export async function deleteQuest(questId) {
  const response = await fetch(
    `${API_URL}/quests/${questId}`,
    {
      method: "DELETE",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Could not delete quest"
    );
  }

  return data;
}
export async function completeQuest(questId, userId) {
  const response = await fetch(
    `${API_URL}/quests/${questId}/complete`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Could not update quest"
    );
  }

  return data;
}
export async function getLeaderboard() {
  const response = await fetch(
    `${API_URL}/leaderboard`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Could not load leaderboard"
    );
  }

  return data;
}
export async function updateCharacter(userId, character) {
  const response = await fetch(`${API_URL}/auth/character`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
      character,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Could not update character"
    );
  }

  return data;
}
export async function getUserProfile(userId) {
  const response = await fetch(
    `${API_URL}/auth/user/${userId}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Could not load user profile"
    );
  }

  return data;
}