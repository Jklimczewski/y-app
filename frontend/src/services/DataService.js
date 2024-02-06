import axios from "axios";

const apiClient = axios.create({
  baseURL: `https://localhost:3000/api`,
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
  addQuote(quoteId, quoteContent) {
    return apiClient.post("/posts/add-quote", { quoteId, quoteContent });
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
  getPosts(pageSize, pageNo) {
    return apiClient.get(
      "/posts/follows" + "?page=" + pageNo + "&pageSize=" + pageSize
    );
  },
  getNewPosts() {
    return apiClient.get("/posts/follows/new");
  },
};
