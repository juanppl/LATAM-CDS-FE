import { Component, OnDestroy, OnInit } from '@angular/core';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/Product';
import { Subscription } from 'rxjs';
import { ProductsTableComponent } from '../../components/products-table/products-table.component';
import { FormComponent } from '../../components/form/form.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SpinnerComponent, ProductsTableComponent, FormComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {

  public isLoading = false;
  public products: Product[] = [];
  private subscription$: Subscription;
  private subscriptionTable$: Subscription;
  public isTableShown: boolean = true;

  constructor(private productService: ProductService) {
    this.subscription$ = this.productService.refreshTable$.subscribe(_ => this.getAllProducts());
    this.subscriptionTable$ = this.productService.displayTable$.subscribe(isShown => this.isTableShown = isShown);
  }

  ngOnInit(): void {
    this.getAllProducts();
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
    this.subscriptionTable$.unsubscribe();
  }

  private getAllProducts(): void {
    this.isLoading = true;
    this.productService.getListOfProducts()
      .subscribe({
        next: (products: Product[]) => {
          this.products = products;
          this.isLoading = false;
        }
      });
  }

  public addNewProduct(): void {
    this.isTableShown = false;
    this.productService.selectedProduct$.next(null);
  }

}
