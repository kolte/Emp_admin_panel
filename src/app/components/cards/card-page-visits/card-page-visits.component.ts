import { Component, OnInit } from "@angular/core";
import { ServicesService } from "src/app/services.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-card-page-visits",
  templateUrl: "./card-page-visits.component.html",
})
export class CardPageVisitsComponent implements OnInit {
  formattedTotalUpTime: string;
  percentage: number;
  get color(): string {
    return this._color;
  }
  set color(color: string) {
    this._color = color !== "light" && color !== "dark" ? "light" : color;
  }
  private _color = "light";
  Employeelist: any = [];
  departmentOption: any = [];
  role = localStorage.getItem('role');

  constructor(public service: ServicesService, public router: Router) { }

  ngOnInit(): void {
    this.getEMployeedata();
    this.departmentDetail();
  }

  getEMployeedata() {
    this.service
      .getEmployeeList()
      .then((response: any) => {
        if (response.data.success) {
          this.Employeelist = response.data.data;
        }
      })
      .catch((error) => {
        if (error.response.status == 401) {
          this.router.navigate(["/auth/login"]);
        }
      });
  }

  DepartmentName(id) {
    return this.departmentOption.find((_: any) => _.id == id)?.department_name;
  }

  departmentDetail() {
    this.service
      .getDepartment()
      .then((response) => {
        if (response.status == 200) {
          this.departmentOption = response.data.data;
        }
      })
      .catch((error) => {
        if (error.response.status == 401) {
          this.router.navigate(["/auth/login"]);
        }
      });
  }

  getImageUrl(profilePicture: string): string {
    const base64Prefix = 'data:image/';
    let imageType = '';

    // Check the image type
    if (profilePicture.startsWith('/9j/') || profilePicture.startsWith('/9j/')) {
      imageType = 'jpeg';
    } else if (profilePicture.startsWith('iVBORw0KGgoAAAANSUhEUgAA')) {
      imageType = 'png';
    } else if (profilePicture.startsWith('R0lGODlh')) {
      imageType = 'gif';
    } else {
      // Default to JPEG if the format is unknown
      imageType = 'jpeg';
    }

    // Return the complete image URL
    return `${base64Prefix}${imageType};base64,${profilePicture}`;
  }

  
  parseTime(timeStr: string): number {
    let timeParts = timeStr.split(' ');
    let hours = 0, minutes = 0, seconds = 0;
    for (let i = 0; i < timeParts.length; i += 2) {
      if (timeParts[i + 1].includes('hour')) {
        hours = parseInt(timeParts[i]);
      } else if (timeParts[i + 1].includes('minute')) {
        minutes = parseInt(timeParts[i]);
      } else if (timeParts[i + 1].includes('second')) {
        seconds = parseInt(timeParts[i]);
      }
    }
    return hours * 3600 + minutes * 60 + seconds;
  }

  calculatePercentage(formattedTotalUpTime: string | null | undefined): number {
    if (!formattedTotalUpTime) {
      return 0; // Return 0 if the formattedTotalUpTime is null or undefined
    }
  
    const totalSeconds = this.parseTime(formattedTotalUpTime);
    const maxSeconds = 8 * 3600; // 8 hours in seconds
    return (totalSeconds / maxSeconds) * 100;
  }
}
