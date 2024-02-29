import { Component, OnInit } from "@angular/core";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { ServicesService } from "src/app/services.service";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute, Router } from "@angular/router";
import moment from "moment";

@Component({
  selector: "app-card-settings",
  templateUrl: "./card-settings.component.html",
})
export class CardSettingsComponent implements OnInit {
  constructor(
    public fb: FormBuilder,
    public service: ServicesService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.getIp();
  }
  EmployeeForm: FormGroup;
  submitted = false;
  editId = null;
  departmentOption: any = [];
  jobOption: any = [];
  userList: any = [];
  birhmindate = moment(new Date().setFullYear(new Date().getFullYear() - 18)).format("YYYY-MM-DD");
  maxdate = moment(new Date()).format("YYYY-MM-DD");
  
  ngOnInit(): void {
    
    this.EmployeeForm = this.fb.group({
      username: ["", [Validators.required]],
      password: ["", [Validators.required, Validators.minLength(6)]],
      email: ["", [Validators.required, Validators.email]],
      first_name: ["", [Validators.required]],
      last_name: ["", [Validators.required]],
      middle_name: ["", [Validators.required]],
      date_of_birth: ["",[Validators.required]],
      gender: ["", [Validators.required]],
      phone: ["", [Validators.required,Validators.minLength(6)]],
      job_id: ["", [Validators.required]],
      department_id: ["", [Validators.required]],
      reporting_to: ["", [Validators.required]],
      salary_info: ["", [Validators.required]],
      hire_date: ["", [Validators.required]],
      address_line1: ["", [Validators.required]],
      address_line2: ["", [Validators.required]],
      pin_code: ["", [Validators.required]],
      city: ["", [Validators.required]],
      state: ["", [Validators.required]],
      work_location: ["", [Validators.required]],
      emergency_contact: ["", [Validators.required]],
      bank_info: ["", [Validators.required]],
    });
    this.departmentDetail();
    this.jobDetail();
    this.userData();
    const id: string = this.route.snapshot.queryParamMap.get("id");

    if (id) {
      this.editId = id;
      this.getEmployeeData(id);
      this.EmployeeForm.controls["username"].clearValidators();
      this.EmployeeForm.controls["username"].updateValueAndValidity();
      this.EmployeeForm.controls["password"].clearValidators();
      this.EmployeeForm.controls["password"].updateValueAndValidity();
    }
  }

  getEmployeeData(id) {
    this.service
      .getEmployeeList()
      .then((response: any) => {
        if (response.data.success) {
          const Employeelist = response.data.data.find((_: any) => _.id == id);
          this.EmployeeForm.patchValue({
            username: Employeelist.username,
            password: Employeelist.password,
            email: Employeelist.email,
            first_name: Employeelist.first_name,
            last_name: Employeelist.last_name,
            middle_name: Employeelist.middle_name,
            date_of_birth: moment(new Date(Employeelist.date_of_birth)).format(
              "YYYY-MM-DD"
            ),
            gender: Employeelist.gender.toString(),
            phone: Employeelist.phone,
            job_id: Employeelist.job_id,
            department_id: Employeelist.department_id,
            reporting_to: Employeelist.reporting_to,
            salary_info: Employeelist.salary_info,
            hire_date: moment(new Date(Employeelist.hire_date)).format(
              "YYYY-MM-DD"
            ),
            address_line1: Employeelist.address_line1,
            address_line2: Employeelist.address_line2,
            pin_code: Employeelist.pin_code,
            city: Employeelist.city,
            state: Employeelist.state,
            work_location: Employeelist.work_location,
            emergency_contact: Employeelist.emergency_contact,
            bank_info: Employeelist.bank_info,
          });
        }
      })
      .catch((error) => {
        if (error.response.status == 401) {
          this.router.navigate(["/auth/login"]);
        }
      });
  }

  get myForm() {
    return this.EmployeeForm.controls;
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

  jobDetail() {
    this.service
      .getJob()
      .then((response) => {
        if (response.status == 200) {
          this.jobOption = response.data.data;
        }
      })
      .catch((error) => {
        if (error.response.status == 401) {
          this.router.navigate(["/auth/login"]);
        }
      });
  }

  userData() {
    this.service
      .getUsers()
      .then((response) => {
        if (response.status == 200) {
          this.userList = response.data.data;
        }
      })
      .catch((error) => {
        if (error.response.status == 401) {
          this.router.navigate(["/auth/login"]);
        }
      });
  }

  getIp() {
    this.service
      .getIpCliente()
      .then((response) => {
        if (response.status == 200) {
          console.log(response.data);
          // this.toastr.success(response.data.message);
          // this.router.navigate(["/admin/employee"]);
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
    if (this.EmployeeForm.invalid) return;
    const data = this.EmployeeForm.value;
    data["status"] = 1;
    data["user_ip"] = "192.168.1.1";
    data["employee_code"] = "EMP003";
    data["employment_status"] = "0";
    if (this.editId) {
      this.service
        .updateEmployee(data, this.editId)
        .then((response) => {
          if (response.status == 200) {
            this.toastr.success(response.data.message);
            this.router.navigate(["/admin/employee"]);
          }
        })
        .catch((error) => {
          if (error.response.status == 401) {
            this.router.navigate(["/auth/login"]);
          }
        });
    } else {
      this.service
        .addEmployee(data)
        .then((response) => {
          if (response.status == 200) {
            this.toastr.success("Employee detail successfully Added");
            this.router.navigate(["/admin/employee"]);
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
