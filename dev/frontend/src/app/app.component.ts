import { Component } from "@angular/core";
import { Router, RouterOutlet } from "@angular/router";
import { HeaderComponent } from "./header.component";
import { NotificationComponent } from "./shared/notification.component";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    NotificationComponent,
    CommonModule, // Add CommonModule for *ngIf
  ],
  template: `
    <app-header *ngIf="!isLoginPage" /> <!-- Conditionally render the header -->
    <app-notification />
    <div class="content-page">
      <router-outlet />
    </div>
  `,
  styles: [
    `
      :host {
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
      }
      .content-page {
        padding: 20px;
        flex-grow: 1;
      }
    `,
  ],
})
export class AppComponent {
  isLoginPage: boolean = false; // Track if the current route is the login page

  constructor(private router: Router) {
    // Subscribe to route changes
    this.router.events.subscribe(() => {
      this.isLoginPage = this.router.url === "/login"; // Update isLoginPage based on the current route
    });
  }
}