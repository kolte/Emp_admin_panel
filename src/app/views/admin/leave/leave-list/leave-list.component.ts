import { CommonModule } from "@angular/common";
import { Component, OnInit, Input, Inject } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ServicesService } from "src/app/services.service";
import { AddServicesService } from "src/app/addservices.service";
import { Router } from "@angular/router";
import { DatePipe } from '@angular/common';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from "@angular/material/dialog";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";

@Component({
  selector: "app-leave-list",
  templateUrl: "./leave-list.component.html",
  styleUrls: ['./leave-list.component.css']
})
export class LeaveListComponent implements OnInit {
  @Input()
  get color(): string {
    return this._color;
  }
  set color(color: string) {
    this._color = color !== "light" && color !== "dark" ? "light" : color;
  }
  private _color = "light";
  Leavelist: any = [];
  ApprovedLeavelist: any = [];
  DeniedLeavelist: any = [];
  managerOption: any = [];
  role=localStorage.getItem('role');
  
  constructor(
    public service: ServicesService,
    public addservice: AddServicesService,
    public router: Router,
    public dialog: MatDialog,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.getLeavedata();
    this.getApprovedLeavedata();
    this.getDeniedLeavedata();
  }

  getLeavedata() {
    this.addservice
      .getLeaveList()
      .then((response: any) => {
        if (response.data.success) {
          this.Leavelist = response.data.data;
          console.log(this.Leavelist);
        }
      })
      .catch((error) => {
        if (error.response.status == 401) {
          this.router.navigate(["/auth/login"]);
        }
      });
  }

  getApprovedLeavedata() {
    this.addservice
      .getApprovedLeaveList()
      .then((response: any) => {
        if (response.data.success) {
          this.ApprovedLeavelist = response.data.data;
        }
      })
      .catch((error) => {
        if (error.response.status == 401) {
          this.router.navigate(["/auth/login"]);
        }
      });
  }

  getDeniedLeavedata() {
    this.addservice
      .getDeniedLeaveList()
      .then((response: any) => {
        if (response.data.success) {
          this.DeniedLeavelist = response.data.data;
        }
      })
      .catch((error) => {
        if (error.response.status == 401) {
          this.router.navigate(["/auth/login"]);
        }
      });
  }


  formatDate(date: string): string {
    // Convert the date string to a JavaScript Date object
    const parsedDate = new Date(date);

    // Apply the desired date format using DatePipe
    const formattedDate = this.datePipe.transform(parsedDate, 'dd/MM/yyyy');

    return formattedDate;
  }
}
