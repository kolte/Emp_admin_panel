import { CommonModule } from "@angular/common";
import { Component, OnInit, Input, Inject } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ServicesService } from "src/app/services.service";
import { Router } from "@angular/router";
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
  selector: "app-project-list",
  templateUrl: "./project-list.component.html",
})
export class ProjectListComponent implements OnInit {
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
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getProjectdata();
    this.projectManagerDetail();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      data: { name: " this.name", animal: "this.animal" },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed", result);
      // this.animal = result;
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
    public service: ServicesService,
  ) {}

  ngOnInit(): void {
    this.getEmployeeData();
    this.EmployeeForm = this.fb.group({
      project_name: ["", [Validators.required]],
      project_description: ["", [Validators.required, Validators.minLength(6)]],
      manager_id: ["", [Validators.required, Validators.email]],
      start_date: ["", [Validators.required]],
      end_date: ["", [Validators.required]],
      status: ["", [Validators.required]],
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
    console.log(this.EmployeeForm.value)
      this.service
        .addProject(this.EmployeeForm.value)
        .then((response) => {
          if (response.status == 200) {
            console.log('data',response)
          }
        })
        .catch((error) => {
          if (error.response.status == 401) {
            // this.router.navigate(["/auth/login"]);
          }
        });
    
  }
}
