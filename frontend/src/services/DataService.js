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
  postsRefreshed() {
    return apiClient.put("/users/profile/posts-refresh");
  },
  addFollow(userId) {
    return apiClient.put("/users/profile/add-follow", { userId });
  },
  deleteFollow(userId) {
    return apiClient.put("/users/profile/delete-follow", { userId });
  },

  addPost(postContent) {
    return apiClient.post("/posts/add-post", { postContent });
  },
  addComment(parentId, commentContent) {
    return apiClient.post("/posts/add-comment", { parentId, commentContent });
  },
  fetchPosts(userId) {
    return apiClient.get("/posts/users/" + userId);
  },
  fetchComments(postId) {
    return apiClient.get("posts/" + postId + "/comments");
  },
  fetchPostData(postId) {
    return apiClient.get("/posts/" + postId);
  },
  getPosts() {
    return apiClient.get("/posts/follows");
  },

  getPersons(pageSize, pageNo) {
    return apiClient.get(
      "/persons" + "/?_limit=" + pageSize + "&_page=" + pageNo
    );
  },
};
