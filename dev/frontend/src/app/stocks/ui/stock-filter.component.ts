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
import { tap } from "rxjs";

@Component({
  selector: "app-stock-filter",
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  styles: [
    `
      :host {
        margin-top: 12px;
        display: block;
      }
      .searchInput{
        color :  #3498db ;
      }
    `,
  ],
  template: `
    <mat-form-field appearance="outline" style="width: 400px; max-width :100%;">
      <mat-label>Search proudct/category</mat-label>
      <input matInput [formControl]="searchTerm" class="searchInput" />
    </mat-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StockFilterComponent {
  searchTerm = new FormControl<string>("");
  @Output() search = new EventEmitter<string | null>();
  constructor() {
    this.searchTerm.valueChanges
      .pipe(
        tap((sTerm) => this.search.emit(sTerm)),
        takeUntilDestroyed()
      )
      .subscribe();
  }
}
