import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ServicesService } from "src/app/services.service";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  screenShoteData: any = [];
  isHovered: boolean = false;
  id: string; // Variable to hold the ID value
  currentPage: number = 0; // Track the current page index
  pageSize: number = 5; // Number of items to load per page
  isLoading: boolean = false; // Prevent multiple simultaneous requests

  constructor(private service: ServicesService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.queryParamMap.get("id"); // Fetching ID from query parameters
    const date = this.route.snapshot.queryParamMap.get("date");
    this.loadMore(); // Load initial data
    const closeButton = document.getElementById('closeButton');
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            this.closeZoomedImage();
        });
    }
  }

  loadMore() {
    if (this.isLoading) return; // Prevent multiple simultaneous requests
    this.isLoading = true;

    const data = {
      employeeId: this.id,
      date: this.route.snapshot.queryParamMap.get("date"),
      page: this.currentPage,
      pageSize: this.pageSize
    };

    this.service.getEmpScreenshoteReport(data)
      .then((response) => {
        if (response.status === 200) {
          const screenShote = response.data.data;

          for (let i = 0; i < screenShote.length; i++) {
            screenShote[i].active_screen = this.activeScreen(screenShote[i].active_screen);
          }

          this.screenShoteData = [...this.screenShoteData, ...screenShote];
          this.currentPage++; // Increment page index for next load
        }
        this.isLoading = false;
      })
      .catch((error) => {
        if (error?.response?.status === 401) {
          this.router.navigate(["/auth/login"]);
        }
        this.isLoading = false;
      });
  }

  activeScreen(data) {
    return JSON.parse(data);
  }

  closeZoomedImage() {
    const zoomedImageContainer = document.getElementById('zoomedImageContainer');
    if (zoomedImageContainer) {
        zoomedImageContainer.classList.remove('active'); // Hide the zoomed image container
    }
  }

  zoomImage(imageSrc: string) {
    const zoomedImageContainer = document.getElementById('zoomedImageContainer');

    if (zoomedImageContainer) {
        const zoomedImage = zoomedImageContainer.querySelector('img');
        if (zoomedImage) {
            zoomedImage.src = imageSrc;
        }

        zoomedImageContainer.classList.add('active'); // Show the zoomed image container
    }
  }
}
