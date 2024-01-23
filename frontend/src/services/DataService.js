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
  changeData(name, surname, phoneNumber) {
    return apiClient.post("/users/profile", { name, surname, phoneNumber });
  },
  getPersons(pageSize, pageNo) {
    return apiClient.get(
      "/persons" + "/?_limit=" + pageSize + "&_page=" + pageNo
    );
  },
  getPerson(id) {
    return apiClient.get("/persons/" + id);
  },
  addPerson(name, address, age, email) {
    return apiClient.post("/persons", { name, address, age, email });
  },
  editPerson(id, name, address, age, email) {
    return apiClient.put("/persons/" + id, { name, address, age, email });
  },
};
