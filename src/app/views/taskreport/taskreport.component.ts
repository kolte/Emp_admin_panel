import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { ServicesService } from "src/app/services.service";
import moment from "moment";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-taskreport",
  templateUrl: "./taskreport.component.html",
  styleUrls: ["./taskreport.component.css"],
})
export class TaskreportComponent implements OnInit {
  screenShoteData: any = [];
  isHovered: boolean = false;
  id: string; // Variable to hold the ID value
  EmployeeForm: FormGroup;
  commentForm: FormGroup;
  Tasklist: any = [];
  empData: any = [];
  projectList: any = [];
  commentData: any = [];
  user_id: number = 0;
  edit_id:null;

  constructor(
    private service: ServicesService,
    private router: Router,
    private route: ActivatedRoute,
    public fb: FormBuilder,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.empDetail();
    this.getProjectdata();
    this.id = this.route.snapshot.queryParamMap.get("id"); // Fetching ID from query parameters
    this.getTaskdata(this.id);
    this.getComment(this.id);
    // const date = this.route.snapshot.queryParamMap.get("date");
    // this.employeePunchInDetail(this.id, date);

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

    this.commentForm = this.fb.group({
      comment_text: ["", [Validators.required]],
    });
  }

  employeePunchInDetail(id: string, date: string) {
    console.log(id, date);
    const data = {
      employeeId: id,
      date: date,
    };
    this.service
      .getEmpScreenshoteReport(data)
      .then((response) => {
        console.log("response.status========>", response.status);
        if (response.status == 200) {
          console.log("response.status========>", response.data.data);
          let screenShote = response.data.data;

          for (let i = 0; i < screenShote.length; i++) {
            screenShote[i].active_screen = this.activeScreen(
              screenShote[i].active_screen
            );
          }
          this.screenShoteData = screenShote;
        }
      })
      .catch((error) => {
        if (error?.response?.status == 401) {
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

  getTaskdata(id) {
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
          this.router.navigate(["/auth/login"]);
        }
      });
  }

  getComment(id) {
    this.service
      .getCommentList(id)
      .then((response) => {
        if (response.status == 200) {
          this.commentData = response.data.comments;
        }
      })
      .catch((error) => {
        if (error.response.status == 401) {
          this.router.navigate(["/auth/login"]);
        }
      });
  }

  getEmpDetail(id) {
    return this.empData.find((_) => _.id == id);
  }
  activeScreen(data) {
    return JSON.parse(data);
  }

  edit(id,comment){
    this.edit_id = id;
    this.commentForm.patchValue({
      comment_text: comment});
    
  }

  delete(id){
    const confirmation = confirm('Are you sure you want to delete this Task?');
    if (confirmation) {
      this.service
      .DeleteComment(id)
      .then((response) => {
        if (response.status == 200) {
          this.getComment(this.id);
        }
      })
      .catch((error) => {
        if (error.response.status == 401) {
          this.router.navigate(["/auth/login"]);
        }
      });
    }
  }


  addComment() {
    if (this.commentForm.valid) {
      const data = {
        task_id: this.id,
        user_id: localStorage.getItem("empId"),
        comment_text: this.commentForm.value.comment_text,
      };
      if(this.edit_id){
        this.service
        .EditComment(this.edit_id,data)
        .then((response) => {
          if (response.status == 200) {
            this.getComment(this.id);
            this.toastr.success(response.data.message);
          }
        })
        .catch((error) => {
          if (error.response.status == 401) {
            this.router.navigate(["/auth/login"]);
          }
        });
        this.edit_id=null;
        this.commentForm.reset();
      }else{
        this.service
          .addCommentList(data)
          .then((response) => {
            if (response.status == 201) {
              this.toastr.success(response.data.message);
              this.getComment(this.id)
              this.commentForm.reset();
            }
          })
          .catch((error) => {
            if (error.response.status == 401) {
              this.router.navigate(["/auth/login"]);
            }
          });
      }
    }
  }
}
