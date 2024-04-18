import { Component, OnInit, Input } from "@angular/core";
import { ServicesService } from "src/app/services.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-emp-list",
  templateUrl: "./emp-list.component.html",
})
export class EmpListComponent implements OnInit {
  @Input()
  get color(): string {
    return this._color;
  }
  set color(color: string) {
    this._color = color !== "light" && color !== "dark" ? "light" : color;
  }
  private _color = "light";
  Employeelist: any = [];
  departmentOption: any = [];
  role=localStorage.getItem('role');

  constructor(public service: ServicesService, public router: Router) {}

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
}
