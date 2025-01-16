import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  inject,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { debounceTime, tap } from "rxjs";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { provideNativeDateAdapter } from "@angular/material/core";
import { MatButtonModule } from "@angular/material/button";
import { getDateWithoutTimezone } from "../../utils/date-utils";
import { MatAutocompleteModule } from "@angular/material/autocomplete";

@Component({
  selector: "app-purchase-filters",
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatButtonModule,
    MatAutocompleteModule,
  ],
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .filters-container {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 16px;
        background-color: #ffffff;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }

      .filter-field {
        width: 300px;
      }

      .clear-button {
        height: 54px;
        width: 100px;
        font-size: 16px;
        font-weight: bold;
        background-color: #3f51b5;
        color: white;
        border: none;
        border-radius: 4px;
        transition: background-color 0.3s ease;
      }

      .clear-button:hover {
        background-color: #303f9f;
      }

      /* Responsive adjustments */
      @media (max-width: 768px) {
        .filters-container {
          flex-direction: column;
          align-items: stretch;
          gap: 12px;
        }

        .filter-field {
          width: 100%;
        }

        .clear-button {
          width: 100%;
        }
      }
    `,
  ],
  template: `
    <div class="filters-container">
      <mat-form-field appearance="outline" class="filter-field">
        <mat-label>Product Name</mat-label>
        <input [formControl]="productName" matInput />
      </mat-form-field>

      <mat-form-field appearance="outline" class="filter-field">
        <mat-date-range-input [formGroup]="range" [rangePicker]="picker">
          <input
            matStartDate
            formControlName="dateFrom"
            placeholder="Start date"
          />
          <input matEndDate formControlName="dateTo" placeholder="End date" />
        </mat-date-range-input>
        <mat-datepicker-toggle
          matIconSuffix
          [for]="picker"
        ></mat-datepicker-toggle>
        <mat-date-range-picker #picker></mat-date-range-picker>
      </mat-form-field>

      <button
        mat-raised-button
        class="clear-button"
        (click)="clearFilters()"
      >
        Clear
      </button>
    </div>
  `,
})
export class PurchaseFilters {
  @Output() searchProduct = new EventEmitter<string | null>();
  @Output() filterByPurchaseDate = new EventEmitter<{
    dateFrom: string | null;
    dateTo: string | null;
  }>();
  @Output() clearFilter = new EventEmitter<void>();

  productName = new FormControl<string>("");
  range = new FormGroup({
    dateFrom: new FormControl<Date | null>(null),
    dateTo: new FormControl<Date | null>(null),
  });

  clearFilters() {
    this.range.patchValue({ dateFrom: null, dateTo: null });
    this.productName.setValue(null);
    this.clearFilter.emit();
  }

  //   onDateFromChange(type: string, event: MatDatepickerInputEvent<Date>) {
  //     console.log(event.value);
  //   }

  constructor() {
    this.productName.valueChanges
      .pipe(
        debounceTime(500),
        tap((v) => {
          this.searchProduct.emit(v);
        }),
        takeUntilDestroyed()
      )
      .subscribe();

    this.range.valueChanges
      .pipe(
        tap((v) => {
          if (v.dateFrom && v.dateTo) {
            this.filterByPurchaseDate.emit({
              dateFrom: getDateWithoutTimezone(v.dateFrom),
              dateTo: getDateWithoutTimezone(v.dateTo),
            });
          }
        }),
        takeUntilDestroyed()
      )
      .subscribe();
  }
}
