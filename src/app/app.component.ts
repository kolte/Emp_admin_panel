import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
})
export class AppComponent {
  title = "angular-dashboard-page";
  constructor(public router:Router){}
  ngOnInit(): void {
    if(localStorage.getItem('token')){

      this.router.navigate(['admin/dashboard'])
    }
    else{
      this.router.navigate(['auth/login'])
    }
  }
}
