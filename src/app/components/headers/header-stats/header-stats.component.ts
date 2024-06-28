import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from "@angular/core";
import Chart from 'chart.js/auto'; // Import Chart.js
import { AddServicesService } from "src/app/addservices.service";
import { Router } from "@angular/router";

interface EmployeeData {
  name: string;
  hours: (string | number)[];
}

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
  workData: EmployeeData[] = []; // Correct type for workData
  totalEmpCnt: number = 0;
  totalPresentCnt: number = 0;
  totalAbsentCnt: number = 0;
  isLoading = false;
  downloadUrlwin32 = '/assets/download/emtrackerWin32.zip';
  downloadUrlwin64 = '/assets/download/emtrackerWin64.zip';
  downloadUrllin32 = '/assets/download/emtrackerLin32.zip';
  downloadUrllin64 = '/assets/download/emtrackerLin64.zip';

  @ViewChild("pieChart", { static: false }) pieChart: ElementRef;
  @ViewChild("barChart") barChart: ElementRef;
  @ViewChild("lineChart") lineChart: ElementRef;

  pieChartRef: any;
  barChartRef: any;
  lineChartRef: any;

  constructor(public service: AddServicesService, public router: Router) { }

  ngOnInit(): void {
    this.getReportTodaydata();
    this.getReportMonthdata();
    this.getCompareMonthdata();
    this.getCompareWeeksdata();
  }

  ngAfterViewInit(): void {
    this.createPieChart();
    this.createLineChart();
  }

  getReportTodaydata() {
    this.service
      .getReportToday()
      .then((response: any) => {
        if (response && response.data.success) {
          // Handle response data here
          this.totalWorkingHours = response.data.total_working_hours;
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
          this.totalMonthHours = response.data.totalHours;
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
          if (response.data.data.changeType == 'decrease') {
            this.comparemonth = 'down';
          } else {
            this.comparemonth = 'up';
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
          if (response.data.data.changeType == 'decrease') {
            this.compareweek = 'down';
          } else {
            this.compareweek = 'up';
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
              labels: ["Absent", "Present", "Total"],
              datasets: [
                {
                  label: "Attendance Sheet",
                  data: [response.data.data.absent_count, response.data.data.present_count, response.data.data.total_count],
                  backgroundColor: ["#FF6384", "green", "#36A2EB"],
                  hoverBackgroundColor: ["#FF6384", "green", "#36A2EB"],
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

  createLineChart(): void {
    this.service.getWorkingDashboardList([])
      .then((response: any) => {
        if (response.data && response.data.success) {
          console.log(response.data.data);
          this.workData = response.data.data as EmployeeData[];

          const canvas = this.lineChart.nativeElement;
          canvas.setAttribute("width", "400"); // Set the width of the canvas
          canvas.setAttribute("height", "200"); // Set the height of the canvas

          const data = this.workData;
          const labels = Array.from({ length: 12 }, (_, i) => {
            const hour = (8 + i) % 12 || 12;
            const period = 8 + i < 12 ? 'AM' : 'PM';
            return `${hour} ${period}`;
          });
          this.lineChartRef = new Chart(canvas, {
            type: "line",
            data: {
              labels: labels,
              datasets: data.map((employee: EmployeeData, index: number) => ({
                label: employee.name,
                data: employee.hours,
                fill: false,
                borderColor: this.getRandomColor(),
                borderWidth: 2,
                tension: 0.1,
                // Add different dash patterns to distinguish lines
                borderDash: [index * 5, 5],
              }))
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                x: {
                  title: {
                    display: true,
                    text: 'Time (Hours)'
                  }
                },
                y: {
                  title: {
                    display: true,
                    text: 'Total Activity (Mouse + Keyboard)'
                  }
                }
              }
            }
          });
        }
      })
      .catch(error => {
        console.error("Error fetching dashboard data:", error);
      });
  }


  getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  onDownloadClick(downloadUrl: string) {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      if (downloadUrl === 'downloadUrlwin32') {
        window.open(this.downloadUrlwin32, '_blank');
      } else if (downloadUrl === 'downloadUrlwin64') {
        window.open(this.downloadUrlwin64, '_blank');
      } else if (downloadUrl === 'downloadUrllin32') {
        window.open(this.downloadUrllin32, '_blank');
      } else if (downloadUrl === 'downloadUrllin64') {
        window.open(this.downloadUrllin64, '_blank');
      } else {
        window.open(this.downloadUrlwin32, '_blank');
      }
    }, 2000); // Simulate a delay for loader, adjust as needed
  }
}
