import { DatePipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatSortModule, Sort } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { SaleModel } from "../../category/sale.model";

@Component({
  selector: "app-sale-list",
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    DatePipe,
    MatSortModule,
  ],
  template: `
    <table
      class="mat-elevation-z8"
      mat-table
      [dataSource]="sales"
      matSort
      (matSortChange)="onSortData($event)"
    >
      <ng-container matColumnDef="sellingDate">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>
          Selling Date (dd-MM-yyyy)
        </th>
        <td mat-cell *matCellDef="let sale">
          {{ sale.sellingDate | date : "dd-MM-yyyy HH:MM" }}
        </td>
      </ng-container>
      <ng-container matColumnDef="productName">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Product Name</th>
        <td mat-cell *matCellDef="let sale">{{ sale.productName }}</td>
      </ng-container>
      <ng-container matColumnDef="price">
        <th mat-header-cell *matHeaderCellDef>Price</th>
        <td mat-cell *matCellDef="let sale">{{ sale.price }}</td>
      </ng-container>

      <ng-container matColumnDef="quantity">
        <th mat-header-cell *matHeaderCellDef>Quantity</th>
        <td mat-cell *matCellDef="let sale">{{ sale.quantity }}</td>
      </ng-container>

      <ng-container matColumnDef="totalPrice">
        <th mat-header-cell *matHeaderCellDef>Total Price</th>
        <td mat-cell *matCellDef="let sale">
          {{ sale.price * sale.quantity }}
        </td>
      </ng-container>

      <ng-container matColumnDef="description">
        <th mat-header-cell *matHeaderCellDef>Description</th>
        <td mat-cell *matCellDef="let sale">{{ sale.description }}</td>
      </ng-container>

      <ng-container matColumnDef="action">
        <th mat-header-cell *matHeaderCellDef>Action</th>
        <td mat-cell *matCellDef="let sale">
          <button
            mat-mini-fab
            color="secondary"
            aria-label="Edit"
            (click)="edit.emit(sale)"
          >
            <mat-icon>edit</mat-icon>
          </button>

          <button
            mat-mini-fab
            color="warn"
            aria-label="Delete"
            (click)="delete.emit(sale)"
          >
            <mat-icon>delete</mat-icon>
          </button>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
    </table>
  `,
  styles: `  /* Table Container */
    .mat-elevation-z8 {
      border-radius: 15px;
      overflow: hidden;
      margin-top: 1.5rem;
      background-color: white;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.14) ;
      
    }

    /* Table Header */
    th.mat-header-cell {
      font-weight: 600;
      font-size: 14px;
      color: #3f51b5;
      background-color: #f5f5f5;
      padding: 16px;
    }

    /* Table Cells */
    td.mat-cell {
      font-size: 14px;
      padding: 12px;
      color: #333;
      
    }

    /* Hover Effect on Rows */
    tr.mat-row:hover {
      background-color: #f9f9f9;
      transition: background-color 0.2s ease;
    }

    /* Action Buttons */
    button.mat-mini-fab {
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      transition: transform 0.2s, box-shadow 0.2s;
        
    
    }
    

    button.mat-mini-fab:hover {
      transform: scale(1.1);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }
    button{
      margin :  5px 4px ; 
      
    }

    /* Spacing Between Buttons */
    button.mat-mini-fab + button.mat-mini-fab {
      margin-left: 20px;
    
    }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SaleListComponent {
  @Input({ required: true }) sales!: SaleModel[];
  @Output() edit = new EventEmitter<SaleModel>();
  @Output() delete = new EventEmitter<SaleModel>();
  @Output() sort = new EventEmitter<{
    sortColumn: string;
    sortDirection: "asc" | "desc";
  }>();

  displayedColumns = [
    "sellingDate",
    "productName",
    "price",
    "quantity",
    "totalPrice",
    "description",
    "action",
  ];

  onSortData(sortData: Sort) {
    this.sort.emit({
      sortColumn: sortData.active,
      sortDirection: sortData.direction as "asc" | "desc",
    });
  }
}
