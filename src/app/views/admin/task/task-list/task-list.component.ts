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
import moment from "moment";

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
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.empDetail();
    this.getProjectdata();
    this.getTaskdata();

  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogTaskeDialog, {
      data:null,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getTaskdata();
    });
  }

  doSomething(data){
    this.getTaskdata()
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
    console.log(
      this.projectList.find((_: any) => _.project_id == id)?.project_name
    );
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
export class DialogTaskeDialog {
  EmployeeForm: FormGroup;
  submitted = false;
  empData: any = [];
  Projectlist: any = [];

  constructor(
    public dialogRef: MatDialogRef<DialogTaskeDialog>,
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
    if (this.data) {
      this.fillTaskData(this.data);
    }
  }

  fillTaskData(id) {
    this.service
      .getTaskList()
      .then((response: any) => {
        if (response.data.success) {
          const Tasklist = response.data.tasks.find(
            (_: any) => _.task_id == id
          );
          this.EmployeeForm.patchValue({
            project_id: Tasklist.project_id,
            task_name: Tasklist.task_name,
            task_description: Tasklist.task_description,
            assignee_id: Tasklist.assignee_id,
            reporter_id: Tasklist.reporter_id,
            priority: Tasklist.priority,
            status: Tasklist.status,
            due_date: moment(new Date(Tasklist.due_date)).format("YYYY-MM-DD"),
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
      if (this.data) {
        this.service
          .editTaskData(this.EmployeeForm.value,this.data)
          .then((response) => {
            if (response.status == 200) {
              this.onNoClick();
              this.toastr.success(response.data.message);
              
            }
          })
          .catch((error) => {
            this.onNoClick();
            if (error.response.status == 401) {
              this.router.navigate(["/auth/login"]);
            }
            else{
              this.toastr.info(error.response.data.message);
            }
          });
      } else {
        this.service
          .addTaskData(this.EmployeeForm.value)
          .then((response) => {
            if (response.status == 201) {
              this.onNoClick();
              this.toastr.success(response.data.message);
            }
          })
          .catch((error) => {
            this.onNoClick();
            if (error.response.status == 401) {
              this.router.navigate(["/auth/login"]);
            }
          });
      }
    }
  }
}
