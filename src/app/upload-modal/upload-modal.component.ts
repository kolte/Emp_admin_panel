import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddServicesService } from "src/app/addservices.service";
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  standalone: true,
  imports: [MatDialogModule],
  selector: 'app-upload-modal',
  templateUrl: './upload-modal.component.html',
  styleUrls: ['./upload-modal.component.css']
})
export class UploadModalComponent {
  selectedFile: File | null = null;

  constructor(
    private addservice: AddServicesService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<UploadModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  upload() {
    if (!this.selectedFile) {
      console.error('No file selected.');
      return;
    }

    const employeeId = this.data.employeeId;
  
    this.addservice.uploadProfilePic(employeeId, this.selectedFile)
      .then(response => {
        console.log('Image uploaded successfully:', response);
        // Show success message
        this.snackBar.open('Image uploaded successfully!', 'Close', {
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
        console.error('Error uploading image:', error);
        // Show error message
        this.snackBar.open('Error uploading image. Please try again.', 'Close', {
          duration: 3000,
        });
        // Handle error as needed
      });
  }
  
  closeDialog() {
    this.dialogRef.close();
  }
}
