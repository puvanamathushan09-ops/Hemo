const BASE_URL = "http://localhost:5001";

// Helper to get auth token from local storage
const getHeaders = () => {
  const token = localStorage.getItem("hemo_token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

export const api = {
  // ---- USERS (Auth) ----
  register: async (userData) => {
    try {
      const res = await fetch(`${BASE_URL}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");
      return data;
    } catch (err) {
      console.error("❌ API Register Error:", err.message);
      if (err.message.includes("Failed to fetch")) {
        throw new Error("Cannot connect to server at Port 5000. Please ensure the backend is running.");
      }
      throw err;
    }
  },
  
  login: async (credentials) => {
    const res = await fetch(`${BASE_URL}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Login failed");
    return data;
  },

  getAllUsers: async () => {
    const res = await fetch(`${BASE_URL}/users`, { headers: getHeaders() });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to fetch users");
    return data;
  },

  // ---- BLOOD REQUESTS ----
  getBloodRequests: async () => {
    const res = await fetch(`${BASE_URL}/blood-requests`, { headers: getHeaders() });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to fetch blood requests");
    return data;
  },

  createBloodRequest: async (requestData) => {
    const res = await fetch(`${BASE_URL}/blood-requests`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(requestData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to create request");
    return data;
  },

  updateBloodRequest: async (id, updateData) => {
    const res = await fetch(`${BASE_URL}/blood-requests/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(updateData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to update request");
    return data;
  },
  
  deleteBloodRequest: async (id) => {
    const res = await fetch(`${BASE_URL}/blood-requests/${id}`, {
      method: "DELETE",
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to delete request");
    return data;
  },

  // ---- DONATIONS ----
  getDonations: async () => {
    const res = await fetch(`${BASE_URL}/donations`, { headers: getHeaders() });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to fetch donations");
    return data;
  },

  createDonation: async (donationData) => {
    const res = await fetch(`${BASE_URL}/donations`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(donationData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to pledge donation");
    return data;
  },

  updateDonation: async (id, updateData) => {
    const res = await fetch(`${BASE_URL}/donations/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(updateData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to update donation");
    return data;
  },

  // ---- HOSPITALS ----
  getHospitals: async () => {
    const res = await fetch(`${BASE_URL}/hospitals`, { headers: getHeaders() });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to fetch hospitals");
    return data;
  },

  createHospital: async (hospitalData) => {
    const res = await fetch(`${BASE_URL}/hospitals`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(hospitalData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to create hospital");
    return data;
  },

  updateHospital: async (id, updateData) => {
    const res = await fetch(`${BASE_URL}/hospitals/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(updateData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to update hospital");
    return data;
  },

  deleteHospital: async (id) => {
    const res = await fetch(`${BASE_URL}/hospitals/${id}`, {
      method: "DELETE",
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to delete hospital");
    return data;
  },

  // ---- USER MANAGEMENT ----
  deleteUser: async (id) => {
    const res = await fetch(`${BASE_URL}/users/${id}`, {
      method: "DELETE",
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to delete user");
    return data;
  },

  updateUser: async (id, updateData) => {
    const res = await fetch(`${BASE_URL}/users/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(updateData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to update user");
    return data;
  },

  // ---- DONATION DELETE ----
  deleteDonation: async (id) => {
    const res = await fetch(`${BASE_URL}/donations/${id}`, {
      method: "DELETE",
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to delete donation");
    return data;
  },

  // ---- NOTIFICATIONS ----
  sendNotifications: async (payload) => {
    const res = await fetch(`${BASE_URL}/notifications/send`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to send notifications");
    return data;
  }
};
