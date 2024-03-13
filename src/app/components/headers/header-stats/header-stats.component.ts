import { Component, OnInit } from "@angular/core";
import { ServicesService } from "src/app/addservices.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-header-stats",
  templateUrl: "./header-stats.component.html",
})
export class HeaderStatsComponent implements OnInit {
  totalWorkingHours: number = 0;
  totalMonthHours: number = 0;
  totalCompareMonthNumber: number = 0;
  comparemonth: string;
  totalCompareWeekNumber: number = 0;
  compareweek: string;
  constructor(public service: ServicesService, public router: Router) {}

  ngOnInit(): void {
    this.getReportTodaydata();
    this.getReportMonthdata();
    this.getCompareMonthdata();
    this.getCompareWeeksdata();
  }

  getReportTodaydata() {
    this.service
      .getReportToday()
      .then((response: any) => {        
        if (response && response.data.success) {
          // Handle response data here
          this.totalWorkingHours = response.data.total_working_hours ;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.status === 401) {
          this.router.navigate(["/auth/login"]);
        }
      });
  }

  getReportMonthdata() {
    this.service
      .getReportMonth()
      .then((response: any) => {        
        if (response && response.data.success) {
          // Handle response data here
          this.totalMonthHours = response.data.totalHours ;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.status === 401) {
          this.router.navigate(["/auth/login"]);
        }
      });
  }

  getCompareMonthdata() {
    this.service
      .getCompareMonth()
      .then((response: any) => {        
        if (response && response.data.success) {
          // Handle response data here
          this.totalCompareMonthNumber = response.data.data.percentageChange;
          if(response.data.data.changeType == 'decrease'){
             this.comparemonth='down';
          }else{
             this.comparemonth='up';
          }
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.status === 401) {
          this.router.navigate(["/auth/login"]);
        }
      });
  }

  getCompareWeeksdata() {
    this.service
      .getCompareWeeks()
      .then((response: any) => {        
        if (response && response.data.success) {
          // Handle response data here
          this.totalCompareWeekNumber = response.data.data.percentageChange;
          if(response.data.data.changeType == 'decrease'){
             this.compareweek='down';
          }else{
             this.compareweek='up';
          }
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.status === 401) {
          this.router.navigate(["/auth/login"]);
        }
      });
  }
}
