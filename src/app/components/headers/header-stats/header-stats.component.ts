import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from "@angular/core";
import Chart from 'chart.js/auto'; // Import Chart.js
import { AddServicesService } from "src/app/addservices.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-header-stats",
  templateUrl: "./header-stats.component.html",
})
export class HeaderStatsComponent implements OnInit, AfterViewInit {
  totalWorkingHours: number = 0;
  totalMonthHours: number = 0;
  totalCompareMonthNumber: number = 0;
  comparemonth: string;
  totalCompareWeekNumber: number = 0;
  compareweek: string;
  totalEmpCnt: number = 0;
  totalPresentCnt: number = 0;
  totalAbsentCnt: number = 0;

  @ViewChild("pieChart", { static: false }) pieChart: ElementRef;
  @ViewChild("barChart") barChart: ElementRef;

  pieChartRef: any;
  barChartRef: any;

  constructor(public service: AddServicesService, public router: Router) {}

  ngOnInit(): void {
    this.getReportTodaydata();
    this.getReportMonthdata();
    this.getCompareMonthdata();
    this.getCompareWeeksdata();
  }

  ngAfterViewInit(): void {
    this.createPieChart();
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

  createPieChart(): void {
    this.service
    .getAttendanceDashboardList()
    .then((response: any) => {        
      if (response && response.data.success) {
        // Handle response data here
        const canvas = this.pieChart.nativeElement;
        canvas.setAttribute("width", "100"); // Set the width of the canvas
        canvas.setAttribute("height", "100"); // Set the height of the canvas
      
        this.pieChartRef = new Chart(canvas, {
          type: "pie",
          data: {
            labels: ["Absent", "Present","Total"],
            datasets: [
              {
                label: "Attendance Sheet",
                data: [response.data.data.absent_count, response.data.data.present_count, response.data.data.total_count],
                backgroundColor: ["#FF6384","green","#36A2EB"],
                hoverBackgroundColor: ["#FF6384","green","#36A2EB"],
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
          },
        });
      }
    })
    .catch((error) => {
      if (error && error.response && error.response.status === 401) {
        this.router.navigate(["/auth/login"]);
      }
    });

  }
  
  
}
