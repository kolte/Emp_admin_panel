import { Injectable } from "@angular/core";
import axios from "axios";

@Injectable({
  providedIn: "root",
})
export class ServicesService {
  constructor() {}

  getRandomJoke(data) {
    return axios.post("http://localhost:3000/api/login", data);
  }
  addEmployee(data) {
    let token = localStorage.getItem("token");
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return axios.post("http://localhost:3000/api/employee", data, options);
  }
  updateEmployee(data, id) {
    let token = localStorage.getItem("token");
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return axios.put(`http://localhost:3000/api/employee/${id}`, data, options);
  }

  getEmployeeList() {
    let token = localStorage.getItem("token");
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return axios.get("http://localhost:3000/api/employeeList", options);
  }

  getDepartment() {
    let token = localStorage.getItem("token");
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return axios.get("http://localhost:3000/api/datafetch/departments", options);
  }
  
  getJob() {
    let token = localStorage.getItem("token");
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return axios.get("http://localhost:3000/api/datafetch/jobs", options);
  }

  getUsers() {
    let token = localStorage.getItem("token");
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return axios.get("http://localhost:3000/api/datafetch/users", options);
  }
}
