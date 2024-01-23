import axios from "axios";

const apiClient = axios.create({
  baseURL: `http://localhost:3000`,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export default {
  register(email, username, password) {
    return apiClient.post("/users/register", { email, username, password });
  },
  login(email, password) {
    return apiClient.post("/users/login", { email, password });
  },
  logout() {
    return apiClient.post("users/logout");
  },
  getData() {
    return apiClient.get("/users/profile");
  },
  fetchData(userId) {
    return apiClient.get("/users/" + userId);
  },
  changeData(name, surname, phoneNumber) {
    return apiClient.put("/users/profile", { name, surname, phoneNumber });
  },
  getPersons(pageSize, pageNo) {
    return apiClient.get(
      "/persons" + "/?_limit=" + pageSize + "&_page=" + pageNo
    );
  },
};
