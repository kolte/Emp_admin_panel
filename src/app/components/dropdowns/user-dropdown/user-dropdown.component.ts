import { Component, AfterViewInit, ViewChild, ElementRef } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { createPopper } from "@popperjs/core";
import { ServicesService } from "src/app/services.service";
import { AddServicesService } from "src/app/addservices.service";

@Component({
  selector: "app-user-dropdown",
  templateUrl: "./user-dropdown.component.html",
})
export class UserDropdownComponent implements AfterViewInit {
  dropdownPopoverShow = false;
  employeeData: any = [];
  emp_id=null;
  @ViewChild("btnDropdownRef", { static: false }) btnDropdownRef: ElementRef;
  @ViewChild("popoverDropdownRef", { static: false })
  popoverDropdownRef: ElementRef;
  constructor(private service: ServicesService,
    private router: Router,
    private addservice: AddServicesService,){
    this.emp_id=localStorage.getItem("empId")||null;
  }
  ngAfterViewInit() {
    this.getEmployeeData(this.emp_id);
    createPopper(
      this.btnDropdownRef.nativeElement,
      this.popoverDropdownRef.nativeElement,
      {
        placement: "bottom-start",
      }
    );
  }
  toggleDropdown(event) {
    event.preventDefault();
    if (this.dropdownPopoverShow) {
      this.dropdownPopoverShow = false;
    } else {
      this.dropdownPopoverShow = true;
    }
  }
  getEmployeeData(id) {
    this.service
      .getEmployeeList()
      .then((response: any) => {
        if (response.data.success) {
          this.employeeData = response.data.data.find((_: any) => _.id == id);
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
