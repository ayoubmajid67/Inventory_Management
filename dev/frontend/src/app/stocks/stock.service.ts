import { Injectable, inject } from "@angular/core";
import { Observable, map } from "rxjs";
import { PaginatedStocks, StockDisplayModel } from "./stock-display.model";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http"; // Import HttpHeaders
import { environment } from "../../environments/environment.development";
import { PaginationModel } from "../shared/models/pagination.model";
import { AuthService } from "../login/services/auth.service"; // Import AuthService

@Injectable({ providedIn: "root" })
export class StockService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.API_BASE_URL + "/stocks";
  private readonly authService = inject(AuthService); // Inject AuthService

  // Helper method to get headers with the authorization token
  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken(); // Get the token from AuthService
    return new HttpHeaders({
      Authorization: `Bearer ${token}`, // Add the token to the Authorization header
    });
  }

  getStocks(
    page = 1,
    limit = 4,
    sortColumn = "Id",
    sortDirection: "asc" | "desc" = "desc",
    searchTerm: string | null = null
  ): Observable<PaginatedStocks> {
    let parameters = new HttpParams()
      .set("page", page)
      .set("limit", limit)
      .set("sortColumn", sortColumn)
      .set("sortDirection", sortDirection);

    if (searchTerm) parameters = parameters.set("searchTerm", searchTerm);
    return this.http
      .get(this.baseUrl, {
        params: parameters,
        observe: "response",
        headers: this.getHeaders(), // Include headers with the token
      })
      .pipe(
        map((response) => {
          var paginationJson = response.headers.get("X-Pagination") as string;
          const pagination: PaginationModel = JSON.parse(paginationJson);
          const stocks: StockDisplayModel[] =
            response.body as StockDisplayModel[];
          const paginatedStock: PaginatedStocks = {
            ...pagination,
            stocks,
          };
          return paginatedStock;
        })
      );
  }
}