 import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
})
export class SidebarComponent implements OnInit {
  collapseShow = "hidden";
  role=localStorage.getItem("role");

  constructor() {}

  ngOnInit() {
    console.log(this.role)
  }
  
  toggleCollapseShow(classes) {
    this.collapseShow = classes;
  }
}
