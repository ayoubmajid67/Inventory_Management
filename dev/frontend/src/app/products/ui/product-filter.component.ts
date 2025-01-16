import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { debounceTime, tap } from "rxjs";

@Component({
  selector: "app-product-filter",
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  styles: [
    `
      .filters-container {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 16px;
      
      }

      .filter-field {
        width: 100%;
        max-width: 400px;
      }

      mat-label {
        font-weight: 500;
        color: #3f51b5;
      }

      input {
        font-size: 16px;
        color: #333;
      }

      /* Hover and Focus Effects */
      mat-form-field.mat-focused .mat-form-field-outline-thick {
        color: #3f51b5;
      }

      mat-form-field:hover .mat-form-field-outline {
        color: #3f51b5;
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
      }
    `,
  ],
  template: `
    <div class="filters-container">
      <mat-form-field appearance="outline" class="filter-field">
        <mat-label>Search product/category</mat-label>
        <input matInput [formControl]="search" />
      </mat-form-field>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductFilterComponent {
  search = new FormControl<string>("");
  @Output() filter = new EventEmitter<string | null>();

  constructor() {
    this.search.valueChanges
      .pipe(
        debounceTime(500),
        tap((val) => {
          this.filter.emit(val);
        }),
        takeUntilDestroyed()
      )
      .subscribe();
  }
}
