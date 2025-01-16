import { AsyncPipe, NgIf } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  inject,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { provideComponentStore } from "@ngrx/component-store";
import { SaleStore } from "./sale.store";
import { ProductService } from "../products/product.service";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { SaleListComponent } from "./ui/sale-list.component";
import { SaleFiltersComponent } from "./ui/sale-filters.component";
import { SaleModel } from "../category/sale.model";
import { capitalize } from "../utils/init-cap.util";
import { ProductWithStock } from "../products/product-with-stock.model";
import { Observable, Subject, switchMap, takeUntil } from "rxjs";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { SaleDialogComponent } from "./ui/sale-dialog.component";
import { SalePaginatorComponent } from "./ui/sale-paginator.component";
import { NotificationService } from "../shared/notification.service"; // Import NotificationService

@Component({
  selector: "app-sale",
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  providers: [provideComponentStore(SaleStore)],
  styles: [
    `
      .sale-container {
        padding: 24px;
        max-width: 1200px;
        margin: 0 auto;
      }

      .sale-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 24px;
      }

      .sale-title {
        font-size: 28px;
        font-weight: bold;
        color: #2c3e50;
      }

      .add-button {
        background-color: #3498db;
        color: #ffffff;
        font-weight: bold;
      }

      .spinner-center {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 200px;
      }

      .no-records {
        text-align: center;
        margin-top: 24px;
        font-size: 18px;
        color: #7f8c8d;
      }

      .filters-section {
        margin-bottom: 24px;
      }

      .sale-list-section {
        margin-bottom: 24px;
      }

      .paginator-section {
        display: flex;
        justify-content: center;
        margin-top: 24px;
      }
    `,
  ],
  template: `
    <div class="sale-container">
      <ng-container *ngIf="products$ | async as products">
        <div class="sale-header">
          <span class="sale-title">Sales</span>
          <button
            mat-raised-button
            class="add-button"
            (click)="onAddUpdate('Add', null, products)"
          >
            Add Sale
          </button>
        </div>

        <ng-container *ngIf="this.saleStore.vm$ | async as vm">
          <!-- Loading spinner -->
          @if(vm.loading){
          <div class="spinner-center">
            <mat-spinner diameter="50"></mat-spinner>
          </div>
          }

          <!-- Always show the filter component -->
          <div class="filters-section">
            <app-sale-filters
              (clearFilter)="onClearFilter()"
              (searchProduct)="onSearch($event)"
              (filterByPurchaseDate)="onDateFilter($event)"
            />
          </div>

          <!-- Show the list and paginator only if there are records -->
          <div class="sale-list-section">
            @if(vm.sales && vm.sales.length > 0) {
            <app-sale-list
              [sales]="vm.sales"
              (edit)="onAddUpdate('Update', $event, products)"
              (sort)="onSort($event)"
              (delete)="onDelete($event)"
            />
            } @else {
            <p class="no-records">No records found</p>
            }
          </div>

          <!-- Paginator -->
          <div class="paginator-section">
            <app-sale-paginator
              [totalRecords]="vm.totalRecords"
              (pageSelect)="onPageSelect($event)"
            />
          </div>
        </ng-container>
      </ng-container>
    </div>
  `,
  imports: [
    NgIf,
    AsyncPipe,
    MatButtonModule,
    MatProgressSpinnerModule,
    SaleListComponent,
    SaleFiltersComponent,
    MatDialogModule,
    SalePaginatorComponent,
  ],
})
export class SaleComponent implements OnDestroy {
  saleStore = inject(SaleStore);
  productService = inject(ProductService);
  notificationService = inject(NotificationService); // Inject NotificationService
  products$: Observable<ProductWithStock[]> =
    this.productService.getAllProductsWithStock();
  destroyed$ = new Subject<boolean>();
  dialog = inject(MatDialog);

  onSort(sortData: { sortColumn: string; sortDirection: "asc" | "desc" }) {
    this.saleStore.setSortColumn(capitalize(sortData.sortColumn));
    this.saleStore.setSortDirection(sortData.sortDirection);
  }

  onAddUpdate(
    action: string,
    sale: SaleModel | null = null,
    products: ProductWithStock[]
  ) {
    const dialogRef = this.dialog.open(SaleDialogComponent, {
      data: { sale, title: action + " Sale", products },
    });

    dialogRef.componentInstance.submit
      .pipe(takeUntil(this.destroyed$))
      .subscribe((submittedSale) => {
        if (!submittedSale) return;
        if (submittedSale.id && submittedSale.id > 0) {
          // Update sale
          this.saleStore.updateSale(submittedSale);
          this.notificationService.send({
            message: "Sale updated successfully",
            severity: "success",
          });
        } else {
          // Add sale
          this.saleStore.addSale(submittedSale);
          this.notificationService.send({
            message: "Sale added successfully",
            severity: "success",
          });
        }
        this._updateProductListQuantity();
        dialogRef.componentInstance.saleForm.reset();
        dialogRef.componentInstance.onCanceled();
      });
  }

  private _updateProductListQuantity() {
    this.products$ = this.products$.pipe(
      switchMap(() => {
        return this.productService.getAllProductsWithStock();
      })
    );
  }

  onDelete(sale: SaleModel) {
    if (window.confirm("Are you sure to delete?")) {
      this.saleStore.deleteSale(sale.id);
      this._updateProductListQuantity();
      this.notificationService.send({
        message: "Sale deleted successfully",
        severity: "success",
      });
    }
  }

  onSearch(productName: string | null) {
    this.saleStore.setProductName(productName);
  }

  onDateFilter(dateRange: { dateFrom: string | null; dateTo: string | null }) {
    if (dateRange.dateFrom && dateRange.dateTo) {
      this.saleStore.setDateFilter({ ...dateRange });
    }
  }

  onClearFilter() {
    this.saleStore.setDateFilter({ dateFrom: null, dateTo: null });
    this.saleStore.setProductName(null);
  }

  onPageSelect(pageData: { page: number; limit: number }) {
    this.saleStore.setPage(pageData.page);
    this.saleStore.setLimit(pageData.limit);
  }

  constructor() {}

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.unsubscribe();
  }
}