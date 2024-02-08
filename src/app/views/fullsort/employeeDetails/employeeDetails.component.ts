import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import dayGridPlugin from '@fullcalendar/daygrid'; 
import timeGridPlugin from '@fullcalendar/timegrid'; 

@Component({
  selector: "app-employeeDetails",
  templateUrl: "./employeeDetails.component.html",
  styleUrls: ["./employeeDetails.component.css"]
})
export class EmployeeDetailsComponent implements OnInit {
  horizontalCalendarOptions: any;
  verticalCalendarOptions: any;

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    // Define punch in and punch out times
    const punchInTime = '09:15';
    const punchOutTime = '12:30';

    // Define options for the horizontal calendar
    this.horizontalCalendarOptions = {
      plugins: [dayGridPlugin], 
      initialView: 'dayGridMonth',
      events: [
        { title: 'Present', date: '2024-02-05', backgroundColor: 'green' }, // Example event for present
        { title: 'Absent', date: '2024-02-06', backgroundColor: 'red' },   // Example event for absent
        { title: 'Present', date: '2024-02-07', backgroundColor: 'green' },
      ],
      themeSystem: 'bootstrap',
      eventClick: this.handleEventClick.bind(this)
    };

    // Define options for the vertical calendar
    this.verticalCalendarOptions = {
      plugins: [timeGridPlugin], 
      initialView: 'timeGrid',
      headerToolbar: {
        left: '',
        center: '',
      },
      events: [
        { title: 'Today', date: new Date().toISOString().slice(0,10) }, // Include only today's date
        { title: 'Punch In', start: new Date().toISOString().slice(0,10) + 'T' + punchInTime, backgroundColor: 'green' },
        { title: 'Punch Out', start: new Date().toISOString().slice(0,10) + 'T' + punchOutTime, backgroundColor: 'red' }
      ],
      themeSystem: 'bootstrap',
      eventClick: this.handleEventClick.bind(this) 
    };
  }

  handleEventClick(info: any) {
    const date = info.event.startStr;
    const id = '123'; 

    const url = `/profile?date=${date}&id=${id}`;

    this.router.navigateByUrl(url);
  }
}
