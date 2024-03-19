import { Component, AfterViewInit, ViewChild, ElementRef, Input, input, Output, EventEmitter } from "@angular/core";
import { Router } from "@angular/router";
import { createPopper } from "@popperjs/core";
import { ToastrService } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ServicesService } from "src/app/services.service";
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from "@angular/material/dialog";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { DialogTaskeDialog } from "src/app/views/admin/task/task-list/task-list.component";
import { DialogOverviewExampleDialog } from "src/app/views/admin/project/project-list/project-list.component";


@Component({
  selector: "app-page-dropdown",
  templateUrl: "./page-dropdown.component.html",
})
export class PageDropdownComponent implements AfterViewInit {
  dropdownPopoverShow = false;
  @Input() updateId:any;
  @Input() Type:String;
  @ViewChild("btnDropdownRef", { static: false }) btnDropdownRef: ElementRef;
  @ViewChild("popoverDropdownRef", { static: false })
  popoverDropdownRef: ElementRef;
  @Output() bookTitleCreated = new EventEmitter<any>();

  constructor(public service: ServicesService,public router:Router,private toastr: ToastrService,public dialog: MatDialog,){}
  
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

  deleteEmployeeData(updateId: number) {
    if(this.Type=="task"){
     const confirmation = confirm('Are you sure you want to delete this Task?');
      if (confirmation) {
        this.service
        .deleteTaskData(updateId)
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
    }
    else if(this.Type=="project"){
      const confirmation = confirm('Are you sure want to remove all the Task of this Project?');
      if (confirmation) {
        this.service
      .deleteProjectData(updateId)
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
