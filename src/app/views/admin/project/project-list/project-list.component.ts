import { CommonModule } from "@angular/common";
import { Component, OnInit, Input, Inject, ViewChild, ElementRef, AfterViewInit } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ServicesService } from "src/app/services.service";
import Swal from 'sweetalert2';
import { Router } from "@angular/router";
import moment from "moment";

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
import { ToastrService } from "ngx-toastr";
import { createPopper } from "@popperjs/core";

@Component({
  selector: "app-project-list",
  templateUrl: "./project-list.component.html",
})
export class ProjectListComponent implements OnInit,AfterViewInit {
  dropdownPopoverShow = false;
  @ViewChild("popoverDropdownRef", { static: false })  popoverDropdownRef: ElementRef;
  @ViewChild("btnDropdownRef", { static: false }) btnDropdownRef: ElementRef;

  @Input()
  get color(): string {
    return this._color;
  }
  set color(color: string) {
    this._color = color !== "light" && color !== "dark" ? "light" : color;
  }
  private _color = "light";
  Projectlist: any = [];
  managerOption: any = [];

  constructor(
    public service: ServicesService,
    public router: Router,
    public dialog: MatDialog,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.getProjectdata();
    this.projectManagerDetail();
  }

  ngAfterViewInit() {
    createPopper(
      this.btnDropdownRef.nativeElement,
      this.popoverDropdownRef.nativeElement,
      {
        placement: "bottom-start",
      }
    );
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      data: null,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getProjectdata();
      // this.animal = result;
    });
  }

 
  doSomething(data){
    this.getProjectdata();
  }
 

  deleteEmp(id){
    Swal.fire({
      title: 'Are you sure want to remove all the Task of this Project?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.deleteProject(id)
      } 
    })
  }

  deleteProject(id){
    this.service
      .deleteProjectData(id)
      .then((response: any) => {
        if (response.data.success) {
          this.toastr.success(response.data.message);
          this.getProjectdata();
        }
      })
      .catch((error) => {
        if (error.response.status == 401) {
          this.router.navigate(["/auth/login"]);
        }
      });
  }

  getProjectdata() {
    this.service
      .getProjectList()
      .then((response: any) => {
        if (response.data.success) {
          this.Projectlist = response.data.projects;
          console.log(this.Projectlist);
        }
      })
      .catch((error) => {
        if (error.response.status == 401) {
          this.router.navigate(["/auth/login"]);
        }
      });
  }

  managerName(id) {
     return this.managerOption.find((_: any) => _.id == id);
  }

  projectManagerDetail() {
    this.service
      .getEmployeeList()
      .then((response) => {
        if (response.status == 200) {
          this.managerOption = response.data.data;
        }
      })
      .catch((error) => {
        if (error.response.status == 401) {
          this.router.navigate(["/auth/login"]);
        }
      });
  }
}

@Component({
  selector: "dialog-overview-example-dialog",
  templateUrl: "./dialog-overview-example-dialog.html",
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
  ],
})
export class DialogOverviewExampleDialog {
  EmployeeForm: FormGroup;
  submitted = false;
  employeeData:any=[];
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public fb: FormBuilder,
    private toastr: ToastrService,
    public service: ServicesService,
  ) {}

  ngOnInit(): void {
    this.getEmployeeData();
    this.EmployeeForm = this.fb.group({
      project_name: ["", [Validators.required]],
      project_description: ["", [Validators.required]],
      project_manager_id: ["", [Validators.required]],
      start_date: ["", [Validators.required]],
      end_date: ["", [Validators.required]],
      status: ["", [Validators.required]],
    });
    if(this.data){
      this.fillEmployeeData(this.data)
    }
  }

  fillEmployeeData(id){
    this.service
    .getProjectList()
    .then((response: any) => {  
      if (response.data.success) {
        const projectList = response.data.projects.find((_: any) => _.project_id == id);
        this.EmployeeForm.patchValue({
          project_name: projectList.project_name,
          project_description: projectList.project_description,
          project_manager_id: projectList.project_manager_id,
          start_date: moment(new Date(projectList.start_date)).format("YYYY-MM-DD"),
          end_date: moment(new Date(projectList.end_date)).format("YYYY-MM-DD"),
          status: projectList.status
        });
      }
    })
    .catch((error) => {
      if (error.response.status == 401) {
        // this.router.navigate(["/auth/login"]);
      }
    });
  }

  get myForm() {
    return this.EmployeeForm.controls;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  getEmployeeData() {
    this.service
      .getEmployeeList()
      .then((response: any) => {
        if (response.data.success) {
          this.employeeData = response.data.data;
        }
      })
      .catch((error) => {
        if (error.response.status == 401) {
          // this.router.navigate(["/auth/login"]);
        }
      });
  }

  onSubmit() {
    this.submitted = true;
    this.EmployeeForm.value.project_manager_id = Number(this.EmployeeForm.value.project_manager_id);
    if(this.EmployeeForm.valid){
      if(this.data){
        this.service
        .editProjectData(this.data,this.EmployeeForm.value)
        .then((response) => {
          if (response.status== 200) {
            this.onNoClick();
            this.toastr.success(response.data.message);
          }
        })
        .catch((error) => {
          if (error.response.status == 401) {
            // this.router.navigate(["/auth/login"]);
          }
        });
      }
      else{
        this.service
          .addProject(this.EmployeeForm.value)
          .then((response) => {
            if (response.status== 201) {
              this.onNoClick();
              this.toastr.success(response.data.message);
            }
          })
          .catch((error) => {
            if (error.response.status == 401) {
              // this.router.navigate(["/auth/login"]);
            }
          });
      }
        
      }
  }
}
