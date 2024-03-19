import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ServicesService } from "src/app/services.service";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  screenShoteData: any = [];
  isHovered: boolean = false;
  id: string; // Variable to hold the ID value

  constructor(private service: ServicesService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.queryParamMap.get("id"); // Fetching ID from query parameters
    const date = this.route.snapshot.queryParamMap.get("date");
    this.employeePunchInDetail(this.id, date);
  }

  employeePunchInDetail(id: string, date: string) {
    console.log(id, date);
    const data = {
      employeeId: id,
      date: date
    };
    this.service
      .getEmpScreenshoteReport(data)
      .then((response) => {
        console.log('response.status========>', response.status)
        if (response.status == 200) {
          console.log('response.status========>', response.data.data)
          let screenShote = response.data.data;

          for (let i = 0; i < screenShote.length; i++) {
            screenShote[i].active_screen = this.activeScreen(screenShote[i].active_screen);
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

  activeScreen(data) {
    return JSON.parse(data);
  }

}
