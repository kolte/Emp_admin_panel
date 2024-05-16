import { Component, OnInit, ChangeDetectorRef  } from "@angular/core";
import Chart from 'chart.js/auto'; // Import Chart.js
import { ActivatedRoute, Router } from "@angular/router";
import { ServicesService } from "src/app/services.service";
import { AddServicesService } from "src/app/addservices.service";

@Component({
  selector: "app-report",
  templateUrl: "./report.component.html",
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  screenShoteData: any = [];
  isHovered: boolean = false;
  id: string; // Variable to hold the ID value
  dates = [];
  selectedDate: string;
  totalEmpCnt: number = 0;
  totalPresentCnt: number = 0;
  totalAbsentCnt: number = 0;

  pieChartRefs: { [key: string]: Chart<"pie", any[], string> } = {};
  barChartRef: any;

  months = [
    { label: 'January', value: 1 },
    { label: 'February', value: 2 },
    { label: 'March', value: 3 },
    { label: 'April', value: 4 },
    { label: 'May', value: 5 },
    { label: 'June', value: 6 },
    { label: 'July', value: 7 },
    { label: 'August', value: 8 },
    { label: 'September', value: 9 },
    { label: 'October', value: 10 },
    { label: 'November', value: 11 },
    { label: 'December', value: 12 }
  ];

  constructor(private cdRef: ChangeDetectorRef, public addservice: AddServicesService, private service: ServicesService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.queryParamMap.get("id"); // Fetching ID from query parameters
    const date = this.route.snapshot.queryParamMap.get("date");
    this.employeePunchInDetail(this.id, date);
    this.generateDateList();
  }

  employeePunchInDetail(id: string, date: string) {
    const data = {
      employeeId: id,
      date: date
    };
    this.service
      .getEmpScreenshoteReport(data)
      .then((response) => {
        if (response.status == 200) {
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

  generateDateList() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1; // Note: January is 0, so we add 1 to get the correct month
  
    // Get the total number of days in the current month
    const lastDayOfMonth = new Date(year, month, 0).getDate();
  
    // Construct startDate and endDate dynamically
    const startDate = `${year}-${month.toString().padStart(2, '0')}-01`; // Ensure month and day are two digits
    const endDate = `${year}-${(month + 1).toString().padStart(2, '0')}-01`;

// Ensure month and day are two digits
  
    const reportData = {
      "startDate": startDate,
      "endDate": endDate
  };
    console.log(reportData);
    this.addservice
    .getMonthlyReport(reportData)
    .then((response: any) => {        
      if (response && response.data.success) {
        response.data.data.forEach(item => {
          const dateString = item.attendance_date; // Use the attendance_date directly
          this.dates.push({date:dateString,total:item.total_employees,present:item.total_employees_present,absent:item.total_employees_absent,leave:item.total_leave_approved});
          this.createPieChart(item.attendance_date, item.total_employees_present, item.total_employees_absent);
          this.cdRef.detectChanges();
        });
      }
    })
    .catch((error) => {
      if (error && error.response && error.response.status === 401) {
        this.router.navigate(["/auth/login"]);
      }
    });
  
  }

  createPieChart(date: string, totalEmployeesPresent: number, totalEmployeesAbsent: number): void {
    this.addservice
      .getAttendanceDashboardList()
      .then((response: any) => {        
        if (response && response.data.success) {
          console.log(totalEmployeesPresent);
          const canvas = document.getElementById('pieChart-' + date) as HTMLCanvasElement;
          canvas.setAttribute("width", "100"); // Set the width of the canvas
          canvas.setAttribute("height", "100"); // Set the height of the canvas
          this.pieChartRefs[date] = new Chart<"pie", any[], string>(canvas, {
            type: "pie",
            data: {
              labels: ["Absent", "Present"],
              datasets: [
                {
                  label: "Attendance Sheet",
                  data: [totalEmployeesAbsent, totalEmployeesPresent],
                  backgroundColor: ["#FF6384", "green"],
                  hoverBackgroundColor: ["#FF6384", "green"],
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
  
  activeScreen(data) {
    return JSON.parse(data);
  }

  onDateSelect(date: string) {
    this.selectedDate = date;
    this.employeePunchInDetail(this.id, date);
  }

  isCurrentMonth(monthValue: number): boolean {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // Note: January is 0, so we add 1 to get the correct month
    return monthValue === currentMonth;
  }
  

  onMonthChange(monthValue: string) {
    // Clear the current dates array
    this.dates = [];
  
    const year = new Date().getFullYear();
    const month = parseInt(monthValue, 10); // Convert to number
  
    const daysInMonth = new Date(year, month, 0).getDate(); // Get the total number of days in the month
  
    // Construct startDate and endDate dynamically
    const startDate = `${year}-${month.toString().padStart(2, '0')}-01`; // Ensure month is two digits
    const endDate = `${year}-${(month + 1).toString().padStart(2, '0')}-01`;

  
    const reportData = {
      startDate: startDate,
      endDate: endDate
    };
    this.addservice
    .getMonthlyReport(reportData)
    .then((response: any) => {        
      if (response && response.data.success) {
        response.data.data.forEach(item => {
          const dateString = item.attendance_date; // Use the attendance_date directly
          this.dates.push({date:dateString,total:item.total_employees,present:item.total_employees_present,absent:item.total_employees_absent,leave:item.total_leave_approved});
          this.createPieChart(item.attendance_date, item.total_employees_present, item.total_employees_absent);
          this.cdRef.detectChanges();
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
