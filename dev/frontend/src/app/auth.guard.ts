import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './login/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const isAuthenticated = this.authService.isAuthenticated();

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      this.router.navigate(['/login']);
      return false;
    }

    // Allow access if authenticated
    return true;
  }
}