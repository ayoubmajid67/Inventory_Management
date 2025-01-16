import { Injectable, inject } from "@angular/core";
import { environment } from "../../environments/environment.development";
import { HttpClient, HttpHeaders } from "@angular/common/http"; // Import HttpHeaders
import { Observable } from "rxjs";
import { CategoryModel } from "./category.model";
import { AuthService } from "../login/services/auth.service"; // Import AuthService

@Injectable({
  providedIn: "root",
})
export class CategoryService {
  private apiUrl = environment.API_BASE_URL + "/categories";
  private http = inject(HttpClient);
  private authService = inject(AuthService); // Inject AuthService

  // Helper method to get headers with the authorization token
  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken(); // Get the token from AuthService
    return new HttpHeaders({
      Authorization: `Bearer ${token}`, // Add the token to the Authorization header
    });
  }

  addCategory(category: CategoryModel): Observable<CategoryModel> {
    return this.http.post<CategoryModel>(this.apiUrl, category, {
      headers: this.getHeaders(), // Include headers with the token
    });
  }

  updateCategory(category: CategoryModel): Observable<CategoryModel> {
    console.log(category);
    const url = `${this.apiUrl}/${category.id}`;
    return this.http.put<CategoryModel>(url, category, {
      headers: this.getHeaders(), // Include headers with the token
    });
  }

  deleteCategory(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url, {
      headers: this.getHeaders(), // Include headers with the token
    });
  }

  getCategory(id: number): Observable<CategoryModel> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<CategoryModel>(url, {
      headers: this.getHeaders(), // Include headers with the token
    });
  }

  getCategories(searchTerm?: string): Observable<CategoryModel[]> {
    let url = this.apiUrl;
    if (searchTerm) {
      url += `?searchTerm=${searchTerm}`;
    }
    return this.http.get<CategoryModel[]>(url, {
      headers: this.getHeaders(), // Include headers with the token
    });
  }
}