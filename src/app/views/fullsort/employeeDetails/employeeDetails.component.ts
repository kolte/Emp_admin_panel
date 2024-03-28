import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import { FullCalendarComponent } from "@fullcalendar/angular";
import { ServicesService } from "src/app/services.service";
import { AddServicesService } from "src/app/addservices.service";
import moment from "moment";
import { MatDialog } from '@angular/material/dialog';
import { UploadModalComponent } from 'src/app/upload-modal/upload-modal.component';

@Component({
  selector: "app-employeeDetails",
  templateUrl: "./employeeDetails.component.html",
  styleUrls: ["./employeeDetails.component.css"],
})
export class EmployeeDetailsComponent implements OnInit {
  horizontalCalendarOptions: any;
  verticalCalendarOptions: any;
  employeeAttendanceData: any = [];
  employeePunchInData: any = [];
  totalTime = 0;
  clickEvent = 0;
  employeeData: any = [];
  id: string;
  jobOption: any = [];
  departmentOption: any = [];

  @ViewChild("fullcalendar") fullcalendar: FullCalendarComponent;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: ServicesService,
    private addservice: AddServicesService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get("id");
    // Define punch in and punch out times
    this.getEmployeeDataImage(this.id);
    this.employeeAttendanceDetail(this.id);
    this.employeePunchInDetail(this.id);
    this.getTimerDetail(this.id, new Date().toISOString().split("T")[0]);
    this.getEmployeeData(this.id);
    this.departmentDetail();
    this.jobDetail();
    

    const punchInTime = "09:15";
    const punchOutTime = "12:30";
    // Define options for the horizontal calendar
    this.horizontalCalendarOptions = {
      plugins: [dayGridPlugin],
      initialView: "dayGridMonth",
      // events: [
      //   { title: "Present", date: "2024-02-05", backgroundColor: "green" }, // Example event for present
      //   { title: "Absent", date: "2024-02-06", backgroundColor: "red" }, // Example event for absent
      //   { title: "Present", date: "2024-02-07", backgroundColor: "green" },
      // ],
      themeSystem: "bootstrap",
      eventClick: this.handleEventClick.bind(this),
    };

    // Define options for the vertical calendar
    this.verticalCalendarOptions = {
      plugins: [timeGridPlugin],
      initialView: "timeGrid",
      headerToolbar: {
        left: "",
        center: "",
      },
      customButtons: {
        next: {
          click: this.nextMonth.bind(this),
        },
        prev: {
          click: this.prevMonth.bind(this),
        },
        today: {
          text: "today",
          click: this.currentDate.bind(this),
        },
      },
      // events: [
      //   { title: "Today", date: new Date().toISOString().slice(0, 10) }, // Include only today's date
      //   {
      //     title: "Punch In",
      //     start: new Date().toISOString().slice(0, 10) + "T" + punchInTime,
      //     backgroundColor: "green",
      //   },
      //   {
      //     title: "Punch Out",
      //     start: new Date().toISOString().slice(0, 10) + "T" + punchOutTime,
      //     backgroundColor: "red",
      //   }
      // ],
      themeSystem: "bootstrap",
      eventClick: this.handleEventClick.bind(this),
    };
  }

  nextMonth(): void {
    const calendarApi = this.fullcalendar.getApi();
    calendarApi.next();
    this.setPunchData(this.fullcalendar.getApi().getDate());
    this.getTimerDetail(
      this.id,
      moment(new Date(this.fullcalendar.getApi().getDate())).format(
        "YYYY-MM-DD"
      )
    );
  }

  prevMonth(): void {
    const calendarApi = this.fullcalendar.getApi();
    calendarApi.prev();
    this.setPunchData(this.fullcalendar.getApi().getDate());
    this.getTimerDetail(
      this.id,
      moment(new Date(this.fullcalendar.getApi().getDate())).format(
        "YYYY-MM-DD"
      )
    );
  }

  currentDate(): void {
    const calendarApi = this.fullcalendar.getApi();
    calendarApi.today();
    this.setPunchData(this.fullcalendar.getApi().getDate());
    this.getTimerDetail(
      this.id,
      moment(new Date(this.fullcalendar.getApi().getDate())).format(
        "YYYY-MM-DD"
      )
    );
  }

  handleEventClick(info: any) {
    const date = info.event.startStr;
    const url = `/profile?date=${date}&id=${this.id}`;
    this.router.navigateByUrl(url);
    console.log('123')
  }

  handledateClick(arg: any) {
    // const date = info.event.startStr;
    // const url = `/profile?date=${date}&id=${this.id}`;
    // this.router.navigateByUrl(url);
    console.log('123456')
  }

  handleRedirectClick(employeeId: number): void {
    const currentDate = new Date().toISOString().split('T')[0]; // Get current date in 'YYYY-MM-DD' format
    const url = `/profile?date=${currentDate}&id=${employeeId}`;
    this.router.navigateByUrl(url);
    console.log('123');
  }

  employeeAttendanceDetail(id) {
    this.service
      .getEmpAttendanceReport(id)
      .then((response) => {
        if (response.status == 200) {
          this.employeeAttendanceData = response.data.data;
          const arr = [];
          for (var i = 0; i < this.employeeAttendanceData.length; i++) {
            let status = 'Absent';
            let color = 'red';
            if (this.employeeAttendanceData[i].present == 0 && this.employeeAttendanceData[i].leave_approved == 0) {
              status = 'Leave Applied';
              color = 'orange';
            } else if (this.employeeAttendanceData[i].present == 1 && this.employeeAttendanceData[i].leave_approved == 0) {
              status = 'Present';
              color = 'green';
            } else if (this.employeeAttendanceData[i].present == 0 && this.employeeAttendanceData[i].leave_approved == 1) {
              status = 'Leave Approved';
              color = 'blue';
            } else if (this.employeeAttendanceData[i].present == 0 && this.employeeAttendanceData[i].leave_approved == 2) {
              status = 'Leave Rejected';
              color = 'red';
            } else if (this.employeeAttendanceData[i].present == 1 && this.employeeAttendanceData[i].leave_approved == 2) {
              status = 'Present (LR)';
              color = 'green';
            } else {
              // Handle any other cases
              status = 'Absent';
              color = 'red';
            }
            arr.push({
              title:status,
              date: moment(
                new Date(this.employeeAttendanceData[i].attendance_date)
              ).format("YYYY-MM-DD"),
              backgroundColor:color,
            });
          }
          this.horizontalCalendarOptions.events = arr;
        }
      })
      .catch((error) => {
        if (error.response.status == 401) {
          this.router.navigate(["/auth/login"]);
        }
      });
  }

  employeePunchInDetail(id) {
    this.service
      .getEmpPunchInReport(id)
      .then((response) => {
        if (response.status == 200) {
          this.employeePunchInData = response.data.data;
          const currentDate = new Date();
          this.setPunchData(currentDate);
        }
      })
      .catch((error) => {
        if (error.response.status == 401) {
          this.router.navigate(["/auth/login"]);
        }
      });
  }

  setPunchData(data) {
    const punchinOUT = this.employeePunchInData.filter(
      (_: any) =>
        moment(new Date(_.created_at)).format("YYYY-MM-DD") ==
        moment(new Date(data)).format("YYYY-MM-DD")
    );
    let setpunchData = [];
    for (let i = 0; i < punchinOUT.length; i++) {
      let modifiedObj = {
        title: "Punch In",
        start:
          new Date(punchinOUT[i].punch_in).toISOString().slice(0, 10) +
          "T" +
          moment(new Date(punchinOUT[i].punch_in)).format("HH:mm"),
        backgroundColor: "green",
      };
      let modifiedsObj = {
        title: "Punch Out",
        start:
          new Date(punchinOUT[i].punch_out).toISOString().slice(0, 10) +
          "T" +
          moment(new Date(punchinOUT[i].punch_out)).format("HH:mm"),
        backgroundColor: "red",
      };

      setpunchData = [modifiedObj, modifiedsObj, ...setpunchData];
    }
    this.verticalCalendarOptions.events = setpunchData;
  }

  getTimerDetail(id, date) {
    const data = {
      id: id,
      date: date,
    };
    this.service
      .getTimerDetail(data)
      .then((response) => {
        if (response.status == 200) {

          this.totalTime = response.data.data[0].total_time ? response.data.data[0].total_time : 0;
          this.clickEvent = response.data.data[0].mouclick ? response.data.data[0].mouclick : 0;
        }
      })
      .catch((error) => {
        if (error.response.status == 401) {
          this.router.navigate(["/auth/login"]);
        }
      });
  }

  getEmployeeData(id) {
    this.service
      .getEmployeeList()
      .then((response: any) => {
        if (response.data.success) {
          this.employeeData = response.data.data.find((_: any) => _.id == id);
        }
      })
      .catch((error) => {
        if (error.response.status == 401) {
          this.router.navigate(["/auth/login"]);
        }
      });
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
  getJobdata(id) {
    return this.jobOption.find((_: any) => _.id == id)?.role_name;
  }
  getDetaprtmentdata(id) {
    return this.departmentOption.find((_: any) => _.id == id)?.department_name;
  }

  getEmployeeDataImage(id: string): void {
    this.addservice
      .getEmployeePicData(id)
      .then((response: any) => {
        if (response.data.success) {
          this.employeeData = response.data;
          // Optionally, you can check if the profile picture exists and decode it
          if (this.employeeData.profilePicture) {
            this.employeeData.profilePicture = atob(this.employeeData.profilePicture);
          }
        }
      })
      .catch((error) => {
        if (error.response && error.response.status == 401) {
          this.router.navigate(["/auth/login"]);
        }
      });
  }

  getImageUrl(profilePicture: string): string {
    const base64Prefix = 'data:image/';
    let imageType = '';

    // Check the image type
    if (profilePicture.startsWith('/9j/') || profilePicture.startsWith('/9j/')) {
      imageType = 'jpeg';
    } else if (profilePicture.startsWith('iVBORw0KGgoAAAANSUhEUgAA')) {
      imageType = 'png';
    } else if (profilePicture.startsWith('R0lGODlh')) {
      imageType = 'gif';
    } else {
      // Default to JPEG if the format is unknown
      imageType = 'jpeg';
    }

    // Return the complete image URL
    return `${base64Prefix}${imageType};base64,${profilePicture}`;
  }

  openUploadModal(employeeId: number) {
    const dialogRef = this.dialog.open(UploadModalComponent, {
      width: '400px',
      data: { employeeId: employeeId }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }


}
