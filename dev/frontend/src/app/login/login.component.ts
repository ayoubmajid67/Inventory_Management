import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar'; // Import MatSnackBar for notifications

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
  ],
  template: `
    <mat-card class="login-card">
      <mat-card-header>
        <mat-card-title>Login</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <mat-form-field appearance="outline">
            <mat-label>Email</mat-label>
            <input matInput formControlName="email" required type="email" />
            <mat-error *ngIf="loginForm.get('email')?.hasError('required')">
              Email is required.
            </mat-error>
            <mat-error *ngIf="loginForm.get('email')?.hasError('email')">
              Please enter a valid email address.
            </mat-error>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Password</mat-label>
            <input matInput type="password" formControlName="password" required />
            <mat-error *ngIf="loginForm.get('password')?.hasError('required')">
              Password is required.
            </mat-error>
          </mat-form-field>
          <button mat-raised-button color="primary" type="submit">Login</button>
        </form>

        <!-- Display error message -->
        <div *ngIf="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      .login-card {
        max-width: 400px;
        margin: 2rem auto;
        padding: 2rem;
      }
      mat-form-field {
        width: 100%;
        margin-bottom: 1rem;
      }
      button {
        width: 100%;
      }
      .error-message {
        color: red;
        margin-top: 1rem;
        text-align: center;
      }
    `,
  ],
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar); // Inject MatSnackBar

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]], // Add email validation
    password: ['', Validators.required],
  });

  errorMessage: string | null = null; // Variable to store the error message

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      // Clear any previous error message
      this.errorMessage = null;

      // Ensure email and password are not null
      if (email && password) {
        this.authService.login(email, password).subscribe({
          next: () => {
            // Navigate to the home page on successful login
            this.router.navigate(['/']);
          },
          error: (err) => {
            console.error('Login failed', err);

            // Set the error message based on the error response
            console.log( err.error); 
            this.errorMessage =JSON.stringify(err.error) ||  'Invalid email or password.';

            // Show a snackbar notification
            this.snackBar.open(this.errorMessage, 'Close', {
              duration: 5000, // Display for 5 seconds
              panelClass: ['error-snackbar'], // Optional: Add custom styling
            });
          },
        });
      } else {
        // Handle the case where email or password is null
        this.errorMessage = 'Email and password are required.';
      }
    }
  }
}