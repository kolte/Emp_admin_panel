import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import { FullCalendarComponent } from "@fullcalendar/angular";
import { ServicesService } from "src/app/services.service";
import moment from "moment";

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
  id: string;
  @ViewChild("fullcalendar") fullcalendar: FullCalendarComponent;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: ServicesService
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get("id");
    // Define punch in and punch out times
    this.employeeAttendanceDetail(this.id);
    this.employeePunchInDetail(this.id);

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
  }

  prevMonth(): void {
    const calendarApi = this.fullcalendar.getApi();
    calendarApi.prev();
    this.setPunchData(this.fullcalendar.getApi().getDate());
  }
  
  currentDate(): void {
    const calendarApi = this.fullcalendar.getApi();
    calendarApi.today();
    this.setPunchData(this.fullcalendar.getApi().getDate());
  }

  handleEventClick(info: any) {
    const date = info.event.startStr;
    const id = "123";

    const url = `/profile?date=${date}&id=${id}`;

    this.router.navigateByUrl(url);
  }

  employeeAttendanceDetail(id) {
    this.service
      .getEmpAttendanceReport(id)
      .then((response) => {
        if (response.status == 200) {
          this.employeeAttendanceData = response.data.data;
          const arr = [];
          for (var i = 0; i < this.employeeAttendanceData.length; i++) {
            arr.push({
              title:
                this.employeeAttendanceData[i].present == 0
                  ? "Absent"
                  : "Present",
              date: moment(
                new Date(this.employeeAttendanceData[i].attendance_date)
              ).format("YYYY-MM-DD"),
              backgroundColor:
                this.employeeAttendanceData[i].present == 0 ? "red" : "green",
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

      setpunchData = [modifiedObj,modifiedsObj, ...setpunchData];
    }
    this.verticalCalendarOptions.events=setpunchData;
  }
}
