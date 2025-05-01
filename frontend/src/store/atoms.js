import { atom, selector } from "recoil";
import axios from "axios"; // You need to import axios

export const user = atom({
  key: "user",
  default: {
    email: null,
    firstName: null,
    lastName: null,
    contactNumber: null,
    address: null,
    role: null
  }
});

export const isLogin = atom({
  key: "isLogin",
  default: localStorage.getItem("token") ? true : false
});

export const userSelector = selector({
  key: "userProfileSelector",
  get: async ({ get }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token found");
        return get(user);
      }
      const response = await axios.get("http://localhost:4000/me", {
        headers: {
          Authorization: "Bearer " + token // Changed from localStorage.token to token
        }
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log("Server error!! " + error.response?.data?.message || error.message);
      return get(user);
    }
  }
});

// Note: You were trying to export 'role' which wasn't defined in your code
// If you need role, you should define it first
// export const role = atom({...});