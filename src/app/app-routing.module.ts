import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

// layouts
import { AdminComponent } from "./layouts/admin/admin.component";
import { AuthComponent } from "./layouts/auth/auth.component";
import { FullsortComponent } from './layouts/fullsort/fullsort.component';

// admin views
import { DashboardComponent } from "./views/admin/dashboard/dashboard.component";
import { MapsComponent } from "./views/admin/maps/maps.component";
import { SettingsComponent } from "./views/admin/settings/settings.component";
import { EmployeeComponent } from "./views/admin/employee/employee.component";
import { EmployeeDetailsComponent } from './views/fullsort/employeeDetails/employeeDetails.component';
import { AttendanceComponent } from './views/attendance/attendance.component';

// auth views
import { LoginComponent } from "./views/auth/login/login.component";
import { RegisterComponent } from "./views/auth/register/register.component";

// no layouts views
import { IndexComponent } from "./views/index/index.component";
import { LandingComponent } from "./views/landing/landing.component";
import { ProfileComponent } from "./views/profile/profile.component";
import { ReportComponent } from './views/report/report.component';
import { TaskreportComponent } from "./views/taskreport/taskreport.component";
import { ProjectComponent } from "./views/admin/project/project.component";
import { TaskComponent } from "./views/admin/task/task.component";
import { LeaveComponent } from './views/admin/leave/leave.component';
import { ModulesComponent } from './views/admin/modules/modules.component';
import { PermissionComponent } from './views/admin/permission/permission.component';

const routes: Routes = [
  // admin views
  {
    path: "admin",
    component: AdminComponent,
    children: [
      { path: "dashboard", component: DashboardComponent },            
      { path: "project", component: ProjectComponent },
      { path: "modules", component: ModulesComponent },      
      { path: "leave", component: LeaveComponent },
      { path: "task", component: TaskComponent },
      { path: "maps", component: MapsComponent },      
      { path: "", redirectTo: "dashboard", pathMatch: "full" },
    ]
  },
  {
    path: "userDashboard",
    component: FullsortComponent,
    children: [// No children here
      { path: "employeeDetails/:id", component: EmployeeDetailsComponent }, 
      { path: "employee", component: EmployeeComponent },
      { path: "report", component: ReportComponent },
      { path: "settings", component: SettingsComponent },
    ]
  },
  {
    path: "attendanceReport",
    component: FullsortComponent,
    children: [// No children here
      { path: "attendanceDetails/:id", component: AttendanceComponent }, 
    ]
  },
  // auth views
  {
    path: "auth",
    component: AuthComponent,
    children: [
      { path: "login", component: LoginComponent },
      { path: "register", component: RegisterComponent },
      { path: "", redirectTo: "login", pathMatch: "full" },
    ],
  },
  // no layout views
  { path: "profile", component: ProfileComponent },  
  { path: "taskreport", component: TaskreportComponent },
  { path: "permission", component: PermissionComponent },
  { path: "landing", component: LandingComponent },
  {
    path: "", component: AuthComponent, children: [
      { path: "", component: LoginComponent },
    ]
  },
  { path: "**", redirectTo: "", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
