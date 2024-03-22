import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  Validators,
  FormBuilder,
} from "@angular/forms";
import { Router } from "@angular/router";
import { ServicesService } from "src/app/services.service";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
})
export class LoginComponent implements OnInit {
  constructor(public fb: FormBuilder,public service:ServicesService,public router:Router,private toastr: ToastrService) { localStorage.clear();}
  SignupForm: FormGroup;
  submitted: boolean = false;

  ngOnInit(): void {
   
    this.SignupForm = this.fb.group({
      username: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required]],
    });
  }

  get myForm() {
    return this.SignupForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.SignupForm.valid) {
      this.service.getRandomJoke(this.SignupForm.value)
      .then((response:any) => {
        if(response.data.success){
          this.toastr.success('Login successfully done');
          localStorage.setItem('token',response.data.token);
          localStorage.setItem('empId',response.data.empID);
          this.router.navigate(['/admin/dashboard']);
        }
      })
      .catch(error => {
        this.toastr.error(error.response.data.message);
        console.log(error);
      });
    }
  }
}
