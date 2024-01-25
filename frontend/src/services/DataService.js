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
  fetchData(userId) {
    return apiClient.get("/users/" + userId);
  },
  getData() {
    return apiClient.get("/users/profile");
  },
  changeData(formData) {
    return apiClient.put("/users/profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  addFollow(userId) {
    return apiClient.put("/users/profile/add-follow", { userId });
  },
  deleteFollow(userId) {
    return apiClient.put("/users/profile/delete-follow", { userId });
  },

  addPost(postContent) {
    return apiClient.post("/posts/addPost", { postContent });
  },
  fetchPosts(userId) {
    return apiClient.get("/posts/" + userId);
  },

  getPersons(pageSize, pageNo) {
    return apiClient.get(
      "/persons" + "/?_limit=" + pageSize + "&_page=" + pageNo
    );
  },
};
