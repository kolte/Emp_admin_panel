import { Component, AfterViewInit, ViewChild, ElementRef, Input, input, Output, EventEmitter } from "@angular/core";
import { Router } from "@angular/router";
import { createPopper } from "@popperjs/core";
import { AddServicesService } from "src/app/addservices.service";
import { ToastrService } from 'ngx-toastr';
import { DialogTaskeDialog } from "src/app/views/admin/task/task-list/task-list.component";
import { DialogOverviewExampleDialog } from "src/app/views/admin/project/project-list/project-list.component";
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from "@angular/material/dialog";

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
  constructor(public service: AddServicesService,public router:Router,private toastr: ToastrService,public dialog: MatDialog){}
  
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
    if(this.Type=="task"){
      let dialogRef =this.dialog.open(DialogTaskeDialog, {
        data: this.updateId,
      });
      dialogRef.afterClosed().subscribe((result) => {
        this.bookTitleCreated.emit(true);
      // this.animal = result;
    });
    }
    else if(this.Type=="project"){
      this.dialog.open(DialogOverviewExampleDialog, {
        data: this.updateId,
      });
    }
  }

  deleteTaskData(updateId: number) {
    const confirmation = confirm('Are you sure you want to delete this employee?');
    if (confirmation) {
      this.service.deleteEmployee(updateId)
        .then((response: any) => {   
          console.log(response);    
          if (response && response.data && response.data.success) {
            // Handle success response here
            console.log('Employee deleted successfully.');
            this.handleSuccessfulDeletion();
          } else {
            // Handle failure response here
            console.error('Failed to delete employee.');
            // Optionally, you can display an error message to the user
          }
        })
        .catch((error) => {
          // Handle error here
          console.error('An error occurred while deleting the employee:', error);
          // Optionally, you can display an error message to the user
        });
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
