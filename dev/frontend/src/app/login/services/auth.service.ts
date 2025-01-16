import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Observable, catchError, throwError, tap, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.API_BASE_URL + '/auth';

  // BehaviorSubject to track authentication state
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.isAuthenticated());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  // Updated login method to use email instead of username
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, { email, password }).pipe(
      tap((response: any) => {
        // Store the token in local storage
        localStorage.setItem('token', response.token);
        // Update authentication state
        this.isAuthenticatedSubject.next(true);
      }),
      catchError(this.handleError) // Handle errors
    );
  }

  logout() {
    // Remove the token on logout
    localStorage.removeItem('token');
    // Update authentication state
    this.isAuthenticatedSubject.next(false);
  }

  isAuthenticated(): boolean {
    // Check if the user is authenticated
    return !!localStorage.getItem('token');
  }
  getToken(): string | null {
    // Retrieve the token from localStorage
    return localStorage.getItem('token');
  }

  // Centralized error handling
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';

    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      // Backend returned an unsuccessful response code
      switch (error.status) {
        case 400:
          errorMessage = 'Invalid request. Please check your input.';
          break;
        case 401:
          errorMessage = 'Invalid email or password.';
          break;
        case 404:
          errorMessage = 'Resource not found.';
          break;
        case 500:
          errorMessage = 'Server error. Please try again later.';
          break;
        default:
          errorMessage = `Server returned code ${error.status}: ${error.message}`;
      }
    }

    // Log the error (optional)
    console.error(errorMessage);

    // Return an observable with a user-facing error message
    return throwError(() => new Error(errorMessage));
  }
}