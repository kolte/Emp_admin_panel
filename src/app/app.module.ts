import { BrowserModule } from '@angular/platform-browser';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { HashLocationStrategy, LocationStrategy, CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';
import { MatTabsModule } from '@angular/material/tabs';
// Layouts
import { AdminComponent } from './layouts/admin/admin.component';
import { FullsortComponent } from './layouts/fullsort/fullsort.component';
import { AuthComponent } from './layouts/auth/auth.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ToastrModule } from 'ngx-toastr';
import { MatDialogModule } from '@angular/material/dialog';

// Admin views
import { DashboardComponent } from './views/admin/dashboard/dashboard.component';
import { MapsComponent } from './views/admin/maps/maps.component';
import { SettingsComponent } from './views/admin/settings/settings.component';
import { TablesComponent } from './views/admin/tables/tables.component';
import { EmployeeComponent } from './views/admin/employee/employee.component';
import { EmployeeDetailsComponent } from './views/fullsort/employeeDetails/employeeDetails.component';
import { EmpListComponent } from './views/admin/employee/emp-list/emp-list.component';
import { ProjectComponent } from './views/admin/project/project.component';
import { ProjectListComponent } from './views/admin/project/project-list/project-list.component';
import { ModulesComponent } from './views/admin/modules/modules.component';
import { ModulesListComponent } from './views/admin/modules/modules-list/modules-list.component';
import { PermissionComponent } from './views/admin/permission/permission.component';
import { PermissionListComponent } from './views/admin/permission/permission-list/permission-list.component';
import { TaskComponent } from './views/admin/task/task.component';
import { TaskListComponent } from './views/admin/task/task-list/task-list.component';
import { LeaveComponent } from './views/admin/leave/leave.component';
import { LeaveListComponent } from './views/admin/leave/leave-list/leave-list.component';

// Auth views
import { LoginComponent } from './views/auth/login/login.component';
import { RegisterComponent } from './views/auth/register/register.component';

// No layouts views
import { IndexComponent } from './views/index/index.component';
import { LandingComponent } from './views/landing/landing.component';
import { ProfileComponent } from './views/profile/profile.component';
import { OfflineactivityComponent } from './views/offlineactivity/offlineactivity.component';
import { ReportComponent } from './views/report/report.component';
import { TaskreportComponent } from './views/taskreport/taskreport.component';

// Components for views and layouts
import { AdminNavbarComponent } from './components/navbars/admin-navbar/admin-navbar.component';
import { AuthNavbarComponent } from './components/navbars/auth-navbar/auth-navbar.component';
import { CardPageVisitsComponent } from './components/cards/card-page-visits/card-page-visits.component';
import { CardProfileComponent } from './components/cards/card-profile/card-profile.component';
import { CardSettingsComponent } from './components/cards/card-settings/card-settings.component';
import { CardSocialTrafficComponent } from './components/cards/card-social-traffic/card-social-traffic.component';
import { CardStatsComponent } from './components/cards/card-stats/card-stats.component';
import { CardTableComponent } from './components/cards/card-table/card-table.component';
import { FooterAdminComponent } from './components/footers/footer-admin/footer-admin.component';
import { FooterComponent } from './components/footers/footer/footer.component';
import { FooterSmallComponent } from './components/footers/footer-small/footer-small.component';
import { HeaderStatsComponent } from './components/headers/header-stats/header-stats.component';
import { IndexNavbarComponent } from './components/navbars/index-navbar/index-navbar.component';
import { MapExampleComponent } from './components/maps/map-example/map-example.component';
import { IndexDropdownComponent } from './components/dropdowns/index-dropdown/index-dropdown.component';
import { TableDropdownComponent } from './components/dropdowns/table-dropdown/table-dropdown.component';
import { PageDropdownComponent } from './components/dropdowns/page-dropdown/page-dropdown.component';
import { PermissionDropdownComponent } from './components/dropdowns/permission-dropdown/permission-dropdown.component';
import { PagesDropdownComponent } from './components/dropdowns/pages-dropdown/pages-dropdown.component';
import { LeaveDropdownComponent } from './components/dropdowns/leave-dropdown/leave-dropdown.component';
import { TaskDropdownComponent } from './components/dropdowns/task-dropdown/task-dropdown.component';
import { NotificationDropdownComponent } from './components/dropdowns/notification-dropdown/notification-dropdown.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { UserDropdownComponent } from './components/dropdowns/user-dropdown/user-dropdown.component';
import { DecimalFormatPipe } from './decimal-format.pipe';
import { TimeAgoPipe } from './customePipe/time-ago.pipe';
import { AttendanceComponent } from './views/attendance/attendance.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    FullsortComponent,
    AuthComponent,
    DashboardComponent,
    MapsComponent,
    SettingsComponent,
    TablesComponent,
    EmployeeComponent,
    ProjectComponent,
    ProjectListComponent,
    ModulesComponent,
    ModulesListComponent,
    PermissionComponent,
    PermissionListComponent,
    LeaveComponent,
    LeaveListComponent,
    LeaveDropdownComponent,
    TaskComponent,
    TaskListComponent,
    TaskDropdownComponent,
    TaskreportComponent,
    EmployeeDetailsComponent,
    EmpListComponent,
    LoginComponent,
    RegisterComponent,
    IndexComponent,
    LandingComponent,
    ProfileComponent,
    OfflineactivityComponent,
    ReportComponent,
    AdminNavbarComponent,
    AuthNavbarComponent,
    CardPageVisitsComponent,
    CardProfileComponent,
    CardSettingsComponent,
    CardSocialTrafficComponent,
    CardStatsComponent,
    CardTableComponent,
    FooterAdminComponent,
    FooterComponent,
    FooterSmallComponent,
    HeaderStatsComponent,
    IndexNavbarComponent,
    MapExampleComponent,
    IndexDropdownComponent,
    TableDropdownComponent,
    PageDropdownComponent,
    PagesDropdownComponent,
    PermissionDropdownComponent,
    NotificationDropdownComponent,
    SidebarComponent,
    UserDropdownComponent,
    DecimalFormatPipe,
    TimeAgoPipe,
    AttendanceComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    FormsModule,
    MatDialogModule,
    AppRoutingModule,
    RouterModule,
    FullCalendarModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatTabsModule,
    ToastrModule.forRoot()
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    DatePipe,
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
