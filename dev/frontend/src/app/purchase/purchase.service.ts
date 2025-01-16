import { Injectable, inject } from "@angular/core";
import { PaginatedPurchase, PurchaseModel } from "./purchase.model";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http"; // Import HttpHeaders
import { environment } from "../../environments/environment.development";
import { Observable, map } from "rxjs";
import { PaginationModel } from "../shared/models/pagination.model";
import { AuthService } from "../login/services/auth.service"; // Import AuthService

@Injectable({
  providedIn: "root",
})
export class PurchaseService {
  private readonly _http = inject(HttpClient);
  private readonly baseUrl = environment.API_BASE_URL + "/purchases";
  private readonly authService = inject(AuthService); // Inject AuthService

  // Helper method to get headers with the authorization token
  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken(); // Get the token from AuthService
    return new HttpHeaders({
      Authorization: `Bearer ${token}`, // Add the token to the Authorization header
    });
  }

  add(purchase: PurchaseModel): Observable<PurchaseModel> {
    return this._http.post<PurchaseModel>(this.baseUrl, purchase, {
      headers: this.getHeaders(), // Include headers with the token
    });
  }

  update(purchase: PurchaseModel): Observable<PurchaseModel> {
    const url = `${this.baseUrl}/${purchase.id}`;
    return this._http.put<PurchaseModel>(url, purchase, {
      headers: this.getHeaders(), // Include headers with the token
    });
  }

  delete(id: number): Observable<any> {
    const url = `${this.baseUrl}/${id}`;
    return this._http.delete<any>(url, {
      headers: this.getHeaders(), // Include headers with the token
    });
  }

  getById(id: number): Observable<PurchaseModel> {
    const url = `${this.baseUrl}/${id}`;
    return this._http.get<PurchaseModel>(url, {
      headers: this.getHeaders(), // Include headers with the token
    });
  }

  getAll(
    page = 1,
    limit = 4,
    productName: string | null = null,
    dateFrom: string | null = null,
    dateTo: string | null = null,
    sortColumn = "Id",
    sortDirection: "asc" | "desc" = "asc"
  ): Observable<PaginatedPurchase> {
    let parameters = new HttpParams();
    parameters = parameters.set("page", page);
    parameters = parameters.set("limit", limit);
    parameters = parameters.set("sortColumn", sortColumn);
    parameters = parameters.set("sortDirection", sortDirection);
    if (productName) {
      parameters = parameters.set("productName", productName);
    }
    if (dateFrom && dateTo) {
      parameters = parameters.set("dateFrom", dateFrom);
      parameters = parameters.set("dateTo", dateTo);
    }
    return this._http
      .get(this.baseUrl, {
        observe: "response",
        params: parameters,
        headers: this.getHeaders(), // Include headers with the token
      })
      .pipe(
        map((response) => {
          const paginationJson = response.headers.get("X-Pagination") as string;
          const pagination = JSON.parse(paginationJson) as PaginationModel;
          const purchases = response.body as PurchaseModel[];
          const data: PaginatedPurchase = { ...pagination, purchases };
          // console.log(response);
          return data;
        })
      );
  }
}