import { Component, AfterViewInit, ViewChild, ElementRef, Input, input } from "@angular/core";
import { Router } from "@angular/router";
import { createPopper } from "@popperjs/core";
import { AddServicesService } from "src/app/addservices.service";
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { LeaveModalComponent } from 'src/app/leave-modal/leave-modal.component';

@Component({
  selector: "app-leave-dropdown",
  templateUrl: "./leave-dropdown.component.html",
})
export class LeaveDropdownComponent implements AfterViewInit {
  dropdownPopoverShow = false;
  @Input() updateId:any;
  @ViewChild("btnDropdownRef", { static: false }) btnDropdownRef: ElementRef;
  @ViewChild("popoverDropdownRef", { static: false })
  popoverDropdownRef: ElementRef;
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

  toggleDropdown(event) {
    event.preventDefault();
    if (this.dropdownPopoverShow) {
      this.dropdownPopoverShow = false;
    } else {
      this.dropdownPopoverShow = true;
    }
  }

  updateEmp(){
    this.router.navigate(['/userDashboard/settings'],{ 
      queryParams: {  
        id: this.updateId
      }
    });
  }

  deleteEmployeeData(updateId: number) {
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
  
  openUploadModal(updateId: number) {
    const dialogRef = this.dialog.open(LeaveModalComponent, {
      width: '400px',
      data: { updateId: updateId }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  
}
