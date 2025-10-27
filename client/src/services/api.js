import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL;

export const api = {
  signup: async (data) =>
    (
      await fetch(`${BASE_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
    ).json(),

  login: async (data) =>
    (
      await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
    ).json(),

  saveBasicInfo: async (data) =>
    (
      await fetch(`${BASE_URL}/user/basic`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
      })
    ).json(),

  verifyUser: async (email, otp) =>
    (
      await fetch(`${BASE_URL}/user/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      })
    ).json(),

  addCard: async (card) => {
    const res = await fetch(`${BASE_URL}/user/cards`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(card),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    try {
      return await res.json();
    } catch {
      return { message: "No JSON returned" };
    }
  },

  getCards: async () => {
    const email = localStorage.getItem("email");
    const res = await fetch(`${BASE_URL}/user/cards?email=${email}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  },
};
