import { Injectable, inject } from "@angular/core";
import { environment } from "../../environments/environment.development";
import { PaginatedProduct, Product } from "./product.model";
import { Observable, map } from "rxjs";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http"; // Import HttpHeaders
import { PaginationModel } from "../shared/models/pagination.model";
import { ProductWithStock } from "./product-with-stock.model";
import { AuthService } from "../login/services/auth.service"; // Import AuthService

@Injectable({
  providedIn: "root",
})
export class ProductService {
  #http = inject(HttpClient);
  #baseUrl = environment.API_BASE_URL + "/products";
  #authService = inject(AuthService); // Inject AuthService

  // Helper method to get headers with the authorization token
  #getHeaders(): HttpHeaders {
    const token = this.#authService.getToken(); // Get the token from AuthService
    return new HttpHeaders({
      Authorization: `Bearer ${token}`, // Add the token to the Authorization header
    });
  }

  addProduct(product: Product): Observable<Product> {
    return this.#http.post<Product>(this.#baseUrl, product, {
      headers: this.#getHeaders(), // Include headers with the token
    });
  }

  updateProduct(product: Product): Observable<Product> {
    const url = `${this.#baseUrl}/${product.id}`;
    return this.#http.put<Product>(url, product, {
      headers: this.#getHeaders(), // Include headers with the token
    });
  }

  deleteProduct(id: number): Observable<any> {
    const url = `${this.#baseUrl}/${id}`;
    return this.#http.delete<any>(url, {
      headers: this.#getHeaders(), // Include headers with the token
    });
  }

  getProduct(id: number): Observable<Product> {
    const url = `${this.#baseUrl}/${id}`;
    return this.#http.get<Product>(url, {
      headers: this.#getHeaders(), // Include headers with the token
    });
  }

  getProducts(
    page = 1,
    limit = 4,
    searchTerm: string | null = null,
    sortColumn: string | null = null,
    sortDirection: string | null = null
  ): Observable<PaginatedProduct> {
    let parameters = new HttpParams();
    parameters = parameters.set("page", page);
    parameters = parameters.set("limit", limit);
    if (searchTerm) parameters = parameters.set("searchTerm", searchTerm);
    if (sortColumn) parameters = parameters.set("sortColumn", sortColumn);
    if (sortDirection)
      parameters = parameters.set("sortDirection", sortDirection);
    return this.#http
      .get(this.#baseUrl, {
        observe: "response",
        params: parameters,
        headers: this.#getHeaders(), // Include headers with the token
      })
      .pipe(
        map((response) => {
          const paginationHeader = response.headers.get(
            "X-Pagination"
          ) as string;
          const paginationData: PaginationModel = JSON.parse(paginationHeader);
          const products = response.body as Product[];
          const productResponse: PaginatedProduct = {
            ...paginationData,
            products,
          };
          return productResponse;
        })
      );
  }

  getAllProductsWithStock(): Observable<ProductWithStock[]> {
    return this.#http.get<ProductWithStock[]>(
      this.#baseUrl + "/all-products-with-stock",
      {
        headers: this.#getHeaders(), // Include headers with the token
      }
    );
  }
}