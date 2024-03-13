import { Injectable } from "@angular/core";
import axios from "axios";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class ServicesService {
  constructor() {}

  endpoint: string = environment.apiURL || "";

  getRandomJoke(data) {
    return axios.post(`${this.endpoint}login`, data);
  }
  addEmployee(data) {
    let token = localStorage.getItem("token");
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return axios.post(`${this.endpoint}employee`, data, options);
  }

  getIpCliente(){
    return axios.get('http://api.ipify.org/?format=jsonp&callback=JSONP_CALLBACK')
  }
  
  updateEmployee(data, id) {
    let token = localStorage.getItem("token");
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return axios.put(`${this.endpoint}employee/${id}`, data, options);
  }

  getEmployeeList() {
    let token = localStorage.getItem("token");
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return axios.get(`${this.endpoint}employeeList`,options);
  }

  getDepartment() {
    let token = localStorage.getItem("token");
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return axios.get(`${this.endpoint}datafetch/departments`, options);
  }
  
  getJob() {
    let token = localStorage.getItem("token");
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return axios.get(`${this.endpoint}datafetch/jobs`, options);
  }

  getUsers() {
    let token = localStorage.getItem("token");
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return axios.get(`${this.endpoint}datafetch/users`, options);
  }

  getEmpAttendanceReport(data) {
    let token = localStorage.getItem("token");
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return axios.get(`${this.endpoint}report?employeeId=${data}`, options);
  }
  getEmpPunchInReport(data) {
    let token = localStorage.getItem("token");
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return axios.get(`${this.endpoint}report/punchin?employeeId=${data}`, options);
  }

  getTimerDetail(data) {
    let token = localStorage.getItem("token");
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return axios.get(`${this.endpoint}report/timereport?employeeId=${data.id}&&date=${data.date}`, options);
  }
  
  getEmpScreenshoteReport(data) {
    let token = localStorage.getItem("token");
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return axios.get(`${this.endpoint}report/screenshots?employeeId=${data.employeeId}&date=${data.date}`, options);
  }

  getProjectList() {
    let token = localStorage.getItem("token");
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return axios.get(`${this.endpoint}project`,options);
  }

  getProjectManager() {
    let token = localStorage.getItem("token");
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return axios.get(`${this.endpoint}datafetch/departments`, options);
  }

  addProject(data) {
    let token = localStorage.getItem("token");
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return axios.post(`${this.endpoint}project`, data,options);
  }

}
