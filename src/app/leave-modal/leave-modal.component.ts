import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddServicesService } from "src/app/addservices.service";
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  standalone: true,
  imports: [MatDialogModule],
  selector: 'app-leave-modal',
  templateUrl: './leave-modal.component.html',
  styleUrls: ['./leave-modal.component.css']
})
export class LeaveModalComponent {
  leaveRemark: string = ''; // Initialize to empty string
  leaveApproval: number = 1;
  constructor(
    private addservice: AddServicesService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<LeaveModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  // Function to handle leave remark textarea change event
  onRemarkSelected(event: any) {
    this.leaveRemark = event.target.value;
  }

  // Function to handle leave approval select change event
  onDropSelected(event: any) {
    this.leaveApproval = event.target.value;
  }


  leave() {
    const updateId = this.data.updateId;
    const leaveData = {
      id:updateId,
      leave_remark:  this.leaveRemark,
      leave_approved_status:  this.leaveApproval
    };
    console.log(leaveData);
    this.addservice.updateLeaveDetails(leaveData)
      .then(response => {
        console.log('Leave details updated successfully:', response);
        // Show success message
        this.snackBar.open('Leave details updated successfully!', 'Close', {
          duration: 3000,
        });
        // Close the dialog after a delay
        setTimeout(() => {
          this.dialogRef.close();
          // Hard refresh the page with full cache clearance after a delay
          setTimeout(() => {
            window.location.reload();
          }, 1000); // Adjust the delay as needed
        }, 3000);
      })
      .catch(error => {
        console.error('Error updating leave details:', error);
        // Show error message
        this.snackBar.open('Error updating leave details. Please try again.', 'Close', {
          duration: 3000,
        });
        // Handle error as needed
      });
  }
  
  
  closeDialog() {
    this.dialogRef.close();
  }
}
