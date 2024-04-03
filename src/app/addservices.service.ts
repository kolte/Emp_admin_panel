import { Injectable } from "@angular/core";
import axios from "axios";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class AddServicesService {
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
  
    return axios.delete(`${this.endpoint}employee/${id}`, options);;
  }

  getEmployeePicData(id: string): Promise<any> {
    const token = localStorage.getItem("token");
    if (!token) {
      return Promise.reject("Token not found. User is not authenticated.");
    }
  
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  
    return axios.get(`${this.endpoint}employee/profilePic/${id}`, options);
  }

  uploadProfilePic(id: number, file: File): Promise<any> {
    const token = localStorage.getItem("token");
    if (!token) {
      return Promise.reject("Token not found. User is not authenticated.");
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result.toString().split(',')[1]; // Extracting base64 string from data URL
        const data = {
          profile_picture: base64String
        };

        const options = {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        };

        axios.post(`${this.endpoint}employee/profile-picture/${id}`, data, options)
          .then(response => {
            resolve(response.data);
          })
          .catch(error => {
            reject(error);
          });
      };
      reader.onerror = error => {
        reject(error);
      };
    });
  }

  getLeaveList() {
    let token = localStorage.getItem("token");
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return axios.get(`${this.endpoint}leave/leave-dates`,options);
  }

  getApprovedLeaveList() {
    let token = localStorage.getItem("token");
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return axios.get(`${this.endpoint}leave/approved-leave-dates`,options);
  }

  getDeniedLeaveList() {
    let token = localStorage.getItem("token");
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return axios.get(`${this.endpoint}leave/denied-leave-dates`,options);
  }

  updateLeaveDetails(leaveData: { id: number, leave_remark: string, leave_approved_status: number }): Promise<any> {
    const token = localStorage.getItem("token");
    if (!token) {
      return Promise.reject("Token not found. User is not authenticated.");
    }
  
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    };
  
    return axios.put(`${this.endpoint}leave/update-leave/`, leaveData, options)
      .then(response => response.data)
      .catch(error => Promise.reject(error));
  }

  getModuleList() {
    let token = localStorage.getItem("token");
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return axios.get(`${this.endpoint}module`,options);
  }
  
  
  addModule(data) {
    let token = localStorage.getItem("token");
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return axios.post(`${this.endpoint}module`, data,options);
  }
  editModule(id,data) {
    let token = localStorage.getItem("token");
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return axios.put(`${this.endpoint}module/${id}`, data,options);
  }

  deleteModuleData(id) {
    let token = localStorage.getItem("token");
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return axios.delete(`${this.endpoint}module/${id}`,options);
  }
  
}
