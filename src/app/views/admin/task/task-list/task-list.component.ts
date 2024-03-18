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
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-task-list",
  templateUrl: "./task-list.component.html",
})
export class TaskListComponent implements OnInit {
  @Input()
  get color(): string {
    return this._color;
  }
  set color(color: string) {
    this._color = color !== "light" && color !== "dark" ? "light" : color;
  }
  private _color = "light";
  Tasklist: any = [];
  empData: any = [];
  projectList: any = [];

  constructor(
    public service: ServicesService,
    public router: Router,
    public dialog: MatDialog,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.empDetail();
    this.getProjectdata();
    this.getTaskdata();
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

  getTaskdata() {
    this.service
      .getTaskList()
      .then((response: any) => {
        if (response.data.success) {
          this.Tasklist = response.data.tasks;
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
          this.projectList = response.data.projects;
        }
      })
      .catch((error) => {
        if (error.response.status == 401) {
          this.router.navigate(["/auth/login"]);
        }
      });
  }

  ProjectName(id) {
    console.log(this.projectList.find((_: any) => _.project_id == id)?.project_name);
    return this.projectList.find((_: any) => _.project_id == id)?.project_name;
  }

  empDetail() {
    this.service
      .getEmployeeList()
      .then((response) => {
        if (response.status == 200) {
          this.empData = response.data.data;
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
  empData: any = [];
  Projectlist: any = [];

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public fb: FormBuilder,
    public service: ServicesService,
    public router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.empDetail();
    this.getProjectdata();
    this.EmployeeForm = this.fb.group({
      project_id: ["", [Validators.required]],
      task_name: ["", [Validators.required]],
      task_description: ["", [Validators.required]],
      assignee_id: ["", [Validators.required]],
      reporter_id: ["", [Validators.required]],
      priority: ["", [Validators.required]],
      status: ["", [Validators.required]],
      due_date: ["", [Validators.required]],
    });
  }

  get myForm() {
    return this.EmployeeForm.controls;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  empDetail() {
    this.service
      .getEmployeeList()
      .then((response) => {
        if (response.status == 200) {
          this.empData = response.data.data;
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
        }
      })
      .catch((error) => {
        if (error.response.status == 401) {
          this.router.navigate(["/auth/login"]);
        }
      });
  }

  onSubmit() {
    this.submitted = true;
    this.EmployeeForm.value.project_id = Number(
      this.EmployeeForm.value.project_id
    );
    this.EmployeeForm.value.assignee_id = Number(
      this.EmployeeForm.value.assignee_id
    );
    this.EmployeeForm.value.reporter_id = Number(
      this.EmployeeForm.value.reporter_id
    );
    if (this.EmployeeForm.valid) {
      this.service
        .addTaskData(this.EmployeeForm.value)
        .then((response) => {
          if (response.status == 201) {
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
