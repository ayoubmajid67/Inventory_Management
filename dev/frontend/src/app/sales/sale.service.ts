import { Injectable, inject } from "@angular/core";
import { environment } from "../../environments/environment.development";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http"; // Import HttpHeaders
import { PaginatedSale, SaleModel } from "../category/sale.model";
import { Observable, delay, map } from "rxjs";
import { PaginationModel } from "../shared/models/pagination.model";
import { AuthService } from "../login/services/auth.service"; // Import AuthService

@Injectable({ providedIn: "root" })
export class SaleService {
  private readonly baseUrl = environment.API_BASE_URL + "/sales";
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService); // Inject AuthService

  // Helper method to get headers with the authorization token
  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken(); // Get the token from AuthService
    return new HttpHeaders({
      Authorization: `Bearer ${token}`, // Add the token to the Authorization header
    });
  }

  addSale(sale: SaleModel): Observable<SaleModel> {
    return this.http.post<SaleModel>(this.baseUrl, sale, {
      headers: this.getHeaders(), // Include headers with the token
    });
  }

  updateSale(sale: SaleModel): Observable<SaleModel> {
    const url = `${this.baseUrl}/${sale.id}`;
    return this.http.put<SaleModel>(url, sale, {
      headers: this.getHeaders(), // Include headers with the token
    });
  }

  deleteSale(id: number): Observable<any> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.delete<any>(url, {
      headers: this.getHeaders(), // Include headers with the token
    });
  }

  getSaleById(id: string): Observable<SaleModel> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<SaleModel>(url, {
      headers: this.getHeaders(), // Include headers with the token
    });
  }

  getSales(
    page = 1,
    limit = 4,
    productName: string | null = null,
    dateFrom: string | null = null,
    dateTo: string | null = null,
    sortColumn = "Id",
    sortDirection: "asc" | "desc" = "asc"
  ): Observable<PaginatedSale> {
    let params = new HttpParams()
      .set("page", page)
      .set("limit", limit)
      .set("sortColumn", sortColumn)
      .set("sortDirection", sortDirection);
    if (productName) params = params.set("productName", productName);
    if (dateFrom && dateTo) {
      params = params.set("dateFrom", dateFrom);
      params = params.set("dateTo", dateTo);
    }
    return this.http
      .get(this.baseUrl, {
        params: params,
        observe: "response",
        headers: this.getHeaders(), // Include headers with the token
      })
      .pipe(
        map((response) => {
          const pagination: PaginationModel = JSON.parse(
            response.headers.get("X-Pagination") as string
          );
          const sales = response.body as SaleModel[];
          const paginatedSale: PaginatedSale = { ...pagination, sales };
          return paginatedSale;
        })
      )
      .pipe(delay(400));
  }
}