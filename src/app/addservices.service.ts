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
  getIpCliente(){
    return axios.get('http://api.ipify.org/?format=jsonp&callback=JSONP_CALLBACK')
  }
  
  getReportToday() {
    let token = localStorage.getItem("token");
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return axios.get(`${this.endpoint}dashboard/today`, options);
  }

  getReportMonth() {
    let token = localStorage.getItem("token");
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return axios.get(`${this.endpoint}dashboard/month`, options);
  }

  getCompareMonth() {
    let token = localStorage.getItem("token");
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return axios.get(`${this.endpoint}dashboard/compareMonth`, options);
  }

  getCompareWeeks() {
    let token = localStorage.getItem("token");
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return axios.get(`${this.endpoint}dashboard/compareWeek`, options);
  }

  deleteEmployee(id: number): Promise<any> {
    const token = localStorage.getItem("token");
    if (!token) {
      return Promise.reject("Token not found. User is not authenticated.");
    }
  
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: 5000,
    };
  
    return axios.delete(`http://localhost:3000/api/employee/${id}`, options);;
  }
}
