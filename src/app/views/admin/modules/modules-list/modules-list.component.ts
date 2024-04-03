import { CommonModule } from "@angular/common";
import { Component, OnInit, Input, Inject, ViewChild, ElementRef, AfterViewInit } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ServicesService } from "src/app/services.service";
import { AddServicesService } from "src/app/addservices.service";
import Swal from 'sweetalert2';
import { Router } from "@angular/router";
import moment from "moment";

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
import { ToastrService } from "ngx-toastr";
import { createPopper } from "@popperjs/core";

@Component({
  selector: "app-modules-list",
  templateUrl: "./modules-list.component.html",
})
export class ModulesListComponent implements OnInit,AfterViewInit {
  dropdownPopoverShow = false;
  @ViewChild("popoverDropdownRef", { static: false })  popoverDropdownRef: ElementRef;
  @ViewChild("btnDropdownRef", { static: false }) btnDropdownRef: ElementRef;

  @Input()
  get color(): string {
    return this._color;
  }
  set color(color: string) {
    this._color = color !== "light" && color !== "dark" ? "light" : color;
  }
  private _color = "light";
  Modulelist: any = [];
  managerOption: any = [];

  constructor(
    public service: ServicesService,
    public addservice: AddServicesService,
    public router: Router,
    public dialog: MatDialog,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.getModuledata();
  }

  ngAfterViewInit() {
    createPopper(
      this.btnDropdownRef.nativeElement,
      this.popoverDropdownRef.nativeElement,
      {
        placement: "bottom-start",
      }
    );
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogmoduleDialog, {
      data: null,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getModuledata();
      // this.animal = result;
    });
  }

 
  doSomething(data){
    this.getModuledata();
  }
 


  deleteModule(id){
    this.addservice
      .deleteModuleData(id)
      .then((response: any) => {
        if (response.data.success) {
          this.toastr.success(response.data.message);
          this.getModuledata();
        }
      })
      .catch((error) => {
        if (error.response.status == 401) {
          this.router.navigate(["/auth/login"]);
        }
      });
  }

  getModuledata() {
    this.addservice
      .getModuleList()
      .then((response: any) => {
        if (response.data.success) {
          this.Modulelist = response.data.data;
        }
      })
      .catch((error) => {
        if (error.response.status == 401) {
          this.router.navigate(["/auth/login"]);
        }
      });
  }

  managerName(id) {
     return this.managerOption.find((_: any) => _.id == id);
  }

 
}

@Component({
  selector: "dialog-overview-example-dialog",
  templateUrl: "./dialog-overview-example-dialog.html",
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
  ],
})
export class DialogmoduleDialog {
  ModuleForm: FormGroup;
  submitted = false;
  employeeData:any=[];
  constructor(
    public dialogRef: MatDialogRef<DialogmoduleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public fb: FormBuilder,
    private toastr: ToastrService,
    public service: ServicesService,
    public addservice: AddServicesService,
  ) {}

  ngOnInit(): void {
    this.ModuleForm = this.fb.group({
      module_name: ["", [Validators.required]],
      module_code: ["", [Validators.required]],
      description: ["", [Validators.required]]
    });
    if(this.data){
      this.fillEmployeeData(this.data)
    }
  }

  fillEmployeeData(id){
    this.addservice
    .getModuleList()
    .then((response: any) => {  
      if (response.data.success) {
        const moduleList = response.data.data.find((_: any) => _.id == id);
        this.ModuleForm.patchValue({
          module_name: moduleList.module_name,
          module_code: moduleList.module_code,
          description: moduleList.description
        });
      }
    })
    .catch((error) => {
      if (error.response.status == 401) {
        // this.router.navigate(["/auth/login"]);
      }
    });
  }

  get myForm() {
    return this.ModuleForm.controls;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }


  onSubmit() {
    this.submitted = true;
    if(this.ModuleForm.valid){
      if(this.data){
        this.addservice
        .editModule(this.data,this.ModuleForm.value)
        .then((response) => {
          if (response.status== 200) {
            this.onNoClick();
            this.toastr.success(response.data.message);
          }
        })
        .catch((error) => {
          if (error.response.status == 401) {
            // this.router.navigate(["/auth/login"]);
          }
        });
      }
      else{
        this.addservice
          .addModule(this.ModuleForm.value)
          .then((response) => {
            if (response.status== 201) {
              this.onNoClick();
              this.toastr.success(response.data.message);
            }
          })
          .catch((error) => {
            if (error.response.status == 401) {
              // this.router.navigate(["/auth/login"]);
            }
          });
      }
        
      }
  }
}
