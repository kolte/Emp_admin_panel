import { Component, OnInit, Input } from "@angular/core";
import { ServicesService } from "src/app/services.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-emp-list",
  templateUrl: "./emp-list.component.html",
})
export class EmpListComponent implements OnInit {
  @Input()
  get color(): string {
    return this._color;
  }
  set color(color: string) {
    this._color = color !== "light" && color !== "dark" ? "light" : color;
  }
  private _color = "light";
  Employeelist:any=[];
  departmentOption:any=[];

  constructor(public service:ServicesService, public router:Router) {}

  ngOnInit(): void {
    this.getEMployeedata();
    this.departmentDetail();
  }

  getEMployeedata(){
    this.service.getEmployeeList()
    .then((response:any) => {
      if(response.data.success){
        this.Employeelist=response.data.data;
      }
    })
    .catch(error => {
      console.log(error);
    });
  }
  
  updateEmp(id){
    this.router.navigate(['/admin/settings'],{ 
      queryParams: {
        id: id
      }
    });
    
  }

  DepartmentName(id){
    return this.departmentOption.find((_:any)=>_.id == id).department_name;
  }
  
  departmentDetail() {
    this.service
        .getDepartment()
        .then((response) => {
          if (response.status == 200) {
            this.departmentOption=response.data.data;
          }
        })
        .catch((error) => {
          console.log(error);
        });
  }

 

}
