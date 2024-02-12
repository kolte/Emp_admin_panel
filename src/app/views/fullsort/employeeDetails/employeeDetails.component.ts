import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { HttpClient } from '@angular/common/http';
import { ServicesService } from "src/app/services.service";

@Component({
  selector: "app-employeeDetails",
  templateUrl: "./employeeDetails.component.html",
  styleUrls: ["./employeeDetails.component.css"]
})
export class EmployeeDetailsComponent implements OnInit {
  horizontalCalendarOptions: any;
  verticalCalendarOptions: any;
  public events: any[];

  constructor(private route: ActivatedRoute, private router: Router, private service: ServicesService, private http: HttpClient) { }

  ngOnInit(): void {
    // Define options for the vertical calendar
    const punchInTime = '09:15';
    const punchOutTime = '18:30';
    this.verticalCalendarOptions = {
      plugins: [timeGridPlugin],
      initialView: 'timeGrid',
      headerToolbar: {
        left: '',
        center: '',
      },
      events: [
        { title: 'Today', date: new Date().toISOString().slice(0, 10) }, // Include only today's date
        { title: 'Punch In', start: new Date().toISOString().slice(0, 10) + 'T' + punchInTime, backgroundColor: 'green' },
        { title: 'Punch Out', start: new Date().toISOString().slice(0, 10) + 'T' + punchOutTime, backgroundColor: 'red' }
      ],
      themeSystem: 'bootstrap',
      eventClick: this.handleEventClick.bind(this)
    };

    // Fetch data from the API and initialize horizontal calendar options
    this.service.getEmployeeReport(1).then(response => {
      const data = response.data.data;
      // Transform API data into FullCalendar events format
      this.events = data.map((item: any) => {
        // Convert the date string to a Date object
        const attendanceDate = new Date(item.attendance_date);
        // Format the date to 'YYYY-MM-DD' format
        const formattedDate = attendanceDate.toISOString().slice(0, 10);
        return {
          title: item.present ? 'Present' : 'Absent',
          date: formattedDate,
          backgroundColor: item.present ? 'green' : 'red'
        };
      });

      // Define options for the horizontal calendar using fetched events
      this.horizontalCalendarOptions = {
        plugins: [dayGridPlugin],
        initialView: 'dayGridMonth',
        events: this.events, // Use the fetched events
        themeSystem: 'bootstrap',
        eventClick: this.handleEventClick.bind(this)
      };

      // Now you can access the events data outside of the .then() block
      
    });
  }

  handleEventClick(info: any) {
    const date = info.event.startStr;
    const id = '123';

    const url = `/profile?date=${date}&id=${id}`;

    this.router.navigateByUrl(url);
  }
}
