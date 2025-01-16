import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import { MatMenuModule } from "@angular/material/menu";
import { MatIconModule } from "@angular/material/icon";
import { CommonModule } from "@angular/common";
import { AuthService } from "./login/services/auth.service";
import { Subscription } from 'rxjs';

@Component({
  selector: "app-header",
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    RouterModule,
    MatMenuModule,
    MatIconModule,
    CommonModule,
  ],
  template: `
    <mat-toolbar color="secondary" class="toolBar" >
      <!-- App Title -->
      <span class="app-title">Inventory Mgt</span>

      <!-- Navigation Buttons (Visible on larger screens) -->
      <div class="nav-buttons">
        <button mat-button routerLink="/home" routerLinkActive="active">
          Home
        </button>
        <button mat-button routerLink="/categories" routerLinkActive="active">
          Category
        </button>
        <button mat-button routerLink="/products" routerLinkActive="active">
          Products
        </button>
        <button mat-button routerLink="/stock" routerLinkActive="active">
          Stock
        </button>
        <button mat-button routerLink="/purchases" routerLinkActive="active">
          Purchases
        </button>
        <button mat-button routerLink="/sales" routerLinkActive="active">
          Sales
        </button>
        <button mat-button (click)="logout()"  style="color: red ;">Logout</button>
      </div>

      <!-- Spacer to push the menu and logo to the right -->
      <span class="example-spacer"></span>

      <!-- Menu Button (Visible on smaller screens) -->
      <button
        mat-icon-button
        class="menu-button"
        (click)="toggleMenu()"
        aria-label="Menu"
      >
        <mat-icon>menu</mat-icon>
      </button>

      <!-- Dropdown Menu for Smaller Screens -->
      <div class="menu" *ngIf="isMenuOpen">
        <button mat-button routerLink="/home" routerLinkActive="active">
          Home
        </button>
        <button mat-button routerLink="/categories" routerLinkActive="active">
          Category
        </button>
        <button mat-button routerLink="/products" routerLinkActive="active">
          Products
        </button>
        <button mat-button routerLink="/stock" routerLinkActive="active">
          Stock
        </button>
        <button mat-button routerLink="/purchases" routerLinkActive="active">
          Purchases
        </button>
        <button mat-button routerLink="/sales" routerLinkActive="active">
          Sales
        </button>
        <button mat-button (click)="logout()" style="color: red ;">Logout</button>
      </div>
    </mat-toolbar>
  `,
  styles: [
    `
      .toolBar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 16px;
        background-color: rgba(251, 251, 251, 0.84);
        color: white;
        box-shadow: 1px 2px 10px rgba(0, 0, 0, 0.11);
      }

      .app-title {
        margin-right: 16px;
        font-weight: bold;
        color: black;
      }

      .nav-buttons {
        display: flex;
        gap: 8px;
      }

      .example-spacer {
        flex: 1 1 auto;
      }

      .active {
        background: #3498db;
        color: white !important;
        margin: 0 10px;
      }

      .menu-button {
        display: none;
        color: white;
      }

      .menu {
        display: none;
        flex-direction: column;
        position: absolute;
        top: 56px;
        right: 16px;
        background: #000000d6;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        z-index: 1000;
      }

      .menu button {
        width: 100%;
        text-align: left;
        color: white;
      }
  

      @media (max-width: 768px) {
        .nav-buttons {
          display: none;
        }

        .menu-button {
          display: block;
        }

        .menu {
          display: flex;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit, OnDestroy {
  isMenuOpen = false;
  isAuthenticated = false;
  private authSubscription: Subscription = Subscription.EMPTY; // Initialize with a dummy subscription

  constructor(private AuthService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Subscribe to authentication state changes
    this.authSubscription = this.AuthService.isAuthenticated$.subscribe(
      (isAuthenticated) => {
        this.isAuthenticated = isAuthenticated;

        // Redirect to login if not authenticated
        if (!isAuthenticated) {
          this.router.navigate(['/login']);
        }
      }
    );
  }

  ngOnDestroy(): void {
    // Unsubscribe to avoid memory leaks
    this.authSubscription.unsubscribe();
  }

  // Toggle menu visibility
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  // Logout the user
  logout() {
    this.AuthService.logout();
  }
}