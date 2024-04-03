import { Component, AfterViewInit, ViewChild, ElementRef, Input, input, Output, EventEmitter } from "@angular/core";
import { Router } from "@angular/router";
import { createPopper } from "@popperjs/core";
import { AddServicesService } from "src/app/addservices.service";
import { ToastrService } from 'ngx-toastr';
import { DialogTaskeDialog } from "src/app/views/admin/task/task-list/task-list.component";
import { DialogOverviewExampleDialog } from "src/app/views/admin/project/project-list/project-list.component";
import {
  MatDialog
} from "@angular/material/dialog";
import { DialogmoduleDialog } from "src/app/views/admin/modules/modules-list/modules-list.component";

@Component({
  selector: "app-permission-dropdown",
  templateUrl: "./permission-dropdown.component.html",
})
export class PermissionDropdownComponent implements AfterViewInit {
  dropdownPopoverShow = false;
  @Input() updateId:any;
  @Input() Type:String;
  @ViewChild("btnDropdownRef", { static: false }) btnDropdownRef: ElementRef;
  @ViewChild("popoverDropdownRef", { static: false })
  popoverDropdownRef: ElementRef;
  @Output() bookTitleCreated = new EventEmitter<any>();
  constructor(public service: AddServicesService,public router:Router,private toastr: ToastrService,public dialog: MatDialog,public addservice: AddServicesService){}
  
  ngAfterViewInit() {
    createPopper(
      this.btnDropdownRef.nativeElement,
      this.popoverDropdownRef.nativeElement,
      {
        placement: "bottom-start",
      }
    );
  }

  handleRedirectClick(employeeId: number): void {
    const url = `/permission?id=${employeeId}`;
    this.router.navigateByUrl(url);
    console.log('123');
  }

  toggleDropdown(event) {
    event.preventDefault();
    if (this.dropdownPopoverShow) {
      this.dropdownPopoverShow = false;
    } else {
      this.dropdownPopoverShow = true;
    }
  }

  updateEmp(){
    console.log(this.Type)
    
     if(this.Type=="module"){
      let dialogRef = this.dialog.open(DialogmoduleDialog, {
        data: this.updateId,
      });

      dialogRef.afterClosed().subscribe((result) => {
        this.bookTitleCreated.emit(true);
      // this.animal = result;
    });
    }
  }

  deleteModule(id){
    this.addservice
      .deleteModuleData(id)
      .then((response: any) => {
        if (response.data.success) {
          this.toastr.success(response.data.message);
          this.bookTitleCreated.emit(true);
        }
      })
      .catch((error) => {
        if (error.response.status == 401) {
          this.router.navigate(["/auth/login"]);
        }
      });
  }
  deleteTaskData(updateId) {
    if(this.Type=="module"){
      const confirmation = confirm('Are you sure you want to delete this module?');
      if (confirmation) {
        this.deleteModule(updateId)
      }
    }
    
  }

  handleSuccessfulDeletion(): void {
    // Action to be performed after successful deletion
    this.toastr.success('Employee deleted successfully!');
  
    // Add a delay of 2 seconds (2000 milliseconds) before refreshing the page
    setTimeout(() => {
      // Perform a hard refresh of the page
      window.location.reload();
    }, 2000);
  }
  
  
}
