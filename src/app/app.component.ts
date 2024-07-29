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
    this.checkAuth();
  }

  
  private checkAuth(): boolean {
    if (localStorage.getItem('token')) {
      return true;
    } else {
      // Redirect to the login page if the user is not authenticated
      this.router.navigate(['auth/login'])
      return false;
    }
  }
}
