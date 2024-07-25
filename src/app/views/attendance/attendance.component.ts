import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ServicesService } from "src/app/services.service";
import { AddServicesService } from "src/app/addservices.service";
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: "app-attendance",
  templateUrl: "./attendance.component.html",
  styleUrls: ['./attendance.component.css']
})
export class AttendanceComponent implements OnInit, AfterViewInit {
  attendanceReportData: any = [];
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['attendance_date', 'punch_in', 'punch_out','formatted_total_sb','formatted_total_lb','is_leave','total_working'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  isHovered: boolean = false;
  id: string; // Variable to hold the ID value
  isZoomedImageActive: boolean = false;
  zoomedImageSrc: string = '';
  selectedDate: string;
  dates = [];
  @ViewChild('zoomedImageContainer') zoomedImageContainer: ElementRef;

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

  constructor(public service: ServicesService, public router: Router, public route: ActivatedRoute, public addservice: AddServicesService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id'); // Get the 'id' parameter from the URL
      const date = this.route.snapshot.queryParamMap.get("date");
      this.employeePunchInDetail(this.id, date);
    });
  }

  ngAfterViewInit(): void {
    this.paginator.pageSize = 31; // Set the page size to 15
    this.dataSource.paginator = this.paginator;
  }

  employeePunchInDetail(id: string, date: string) {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1; // Note: January is 0, so we add 1 to get the correct month
  
    // Get the total number of days in the current month
    const lastDayOfMonth = new Date(year, month, 0).getDate();
  
    // Construct startDate and endDate dynamically
    const startDate = `${year}-${month.toString().padStart(2, '0')}-01`; // Ensure month and day are two digits
    const endDate = `${year}-${(month + 1).toString().padStart(2, '0')}-01`;
    const data = {
      employeeId: id,
      startDate: startDate,
      endDate:endDate
    };
    this.addservice
      .getAttendanceReport(data)
      .then((response) => {
        if (response.status == 200) {
          console.log('response.status========>', response.data.data);      
          this.attendanceReportData = response.data.data;
          this.dataSource.data = this.attendanceReportData;
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

  closeZoomedImage() {
    this.isZoomedImageActive = false;
  }

  zoomImage(imageSrc: string) {
    this.zoomedImageSrc = imageSrc;
    this.isZoomedImageActive = true;
  }

  onMonthChange(monthValue: string,id) {
    // Clear the current dates array
    this.dates = [];
  
    const year = new Date().getFullYear();
    const month = parseInt(monthValue, 10); // Convert to number
  
    const daysInMonth = new Date(year, month, 0).getDate(); // Get the total number of days in the month
  
    // Construct startDate and endDate dynamically
    const startDate = `${year}-${month.toString().padStart(2, '0')}-01`; // Ensure month is two digits
    const endDate = `${year}-${(month + 1).toString().padStart(2, '0')}-01`;

    const reportData = {
      employeeId: id,
      startDate: startDate,
      endDate:endDate
    };
    this.addservice
    .getAttendanceReport(reportData)
    .then((response: any) => {        
      if (response.status == 200) {
        console.log('response.status========>', response.data.data);      
        this.attendanceReportData = response.data.data;
        this.dataSource.data = this.attendanceReportData;
      }
    })
    .catch((error) => {
      if (error && error.response && error.response.status === 401) {
        this.router.navigate(["/auth/login"]);
      }
    });
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

  calculateTotalWorkingHours(total: number, totalSb: number, totalLb: number): string {
    const totalWorkingMinutes = total - totalSb - totalLb;

    const hours = Math.floor(totalWorkingMinutes / 60);
    const minutes = Math.floor(totalWorkingMinutes % 60);
    const seconds = Math.floor((totalWorkingMinutes * 60) % 60);

    return `${hours} hours ${minutes} minutes ${seconds} seconds`;
  }
}
