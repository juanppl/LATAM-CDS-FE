import { Component, Input } from '@angular/core';
import { Product } from '../../models/Product';
import { CurrencyPipe, DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-products-table',
  standalone: true,
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './products-table.component.html',
  styleUrl: './products-table.component.scss'
})
export class ProductsTableComponent {
  @Input({required: true}) products: Product[] = [];

  constructor(private productService: ProductService) {}

  public removeProduct(product: Product): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to delete a product',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: 'rgb(221, 51, 51)',
      confirmButtonColor: '#6ca100',
      confirmButtonText: 'Confirm'
    }).then((borrar: any) => {
      if (borrar.value) {
        this.deleteProduct(product.id!);
      }
    });
  }

  private deleteProduct(productId: number): void {
    this.productService.deleteProduct(productId)
      .subscribe({
        next: () => {
          this.productService.refreshTable$.next();
        }
      });
  }

  public editProduct(product: Product): void {
    setTimeout(() => {
      this.productService.displayTable$.next(false);
      this.productService.selectedProduct$.next(product);
    }, 100);
  }
}
