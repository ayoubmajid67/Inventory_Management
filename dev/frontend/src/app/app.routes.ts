import { Routes } from "@angular/router";
import { HomeComponent } from "./home.component";
import { AuthGuard } from "./auth.guard"; // Import the AuthGuard

export const routes: Routes = [
  {
    path: "home",
    component: HomeComponent,
    canActivate: [AuthGuard], // Protect this route
  },
  {
    path: "categories",
    loadComponent: () =>
      import("./category/category.component").then((a) => a.CategoryComponent),
    canActivate: [AuthGuard], // Protect this route
  },
  {
    path: "products",
    loadComponent: () =>
      import("./products/product.component").then((a) => a.ProductComponent),
    canActivate: [AuthGuard], // Protect this route
  },
  {
    path: "purchases",
    loadComponent: () =>
      import("./purchase/purchase.component").then((a) => a.PurchaseComponent),
    canActivate: [AuthGuard], // Protect this route
  },
  {
    path: "sales",
    loadComponent: () =>
      import("./sales/sale.component").then((c) => c.SaleComponent),
    canActivate: [AuthGuard], // Protect this route
  },
  {
    path: "stock",
    loadComponent: () =>
      import("./stocks/stock.component").then((a) => a.StockComponent),
    canActivate: [AuthGuard], // Protect this route
  },
  {
    path: "login",
    loadComponent: () =>
      import("./login/login.component").then((a) => a.LoginComponent),
  },
  {
    path: "",
    redirectTo: "/home",
    pathMatch: "full",
  },
  {
    path: "**",
    loadComponent: () =>
      import("./not-found.component").then((a) => a.NotFoundComponent),
  },
];