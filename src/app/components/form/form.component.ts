import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { ProductService } from '../../services/product.service';
import { Category } from '../../models/Category';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Product } from '../../models/Product';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent implements OnInit, OnDestroy {

  public product: Product | null = this.initializeProduct();
  public categories: Category[] = [];
  private subscription$: Subscription;
  public isSaving = false;

  constructor(
    private categoryService: CategoryService,
    private productService: ProductService
  ) {
    this.subscription$ = this.productService.selectedProduct$
      .subscribe((product: Product | null) => {
        this.product = product;
        if (!this.product) this.product = this.initializeProduct();
      });
  }

  private initializeProduct(): Product {
    return {
      id: null,
      fullName: '',
      displayName: '',
      description: '',
      price: 0,
      isActive: true,
      creationDate: new Date(),
      expireDate: null,
      expireDateAsString: '',
      categoryId: null,
      availableQty: 0,
      lastModificationDate: new Date(),
      isDeleted: false,
      deletedDate: null,
      category: null,
    }
  }

  ngOnInit(): void {
    this.getListOfCategories();
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }

  private getListOfCategories(): void {
    this.categoryService.getListOfCategories()
      .subscribe({
        next: (categories: Category[]) => {
          this.categories = categories;
        }
      });
  }

  public save(): void {
    this.isSaving = true;
    if (this.product?.id && this.product.id != -1) {
      this.editProduct(this.product);
    } else {
      this.addNewProduct(this.product!);
    }
  }

  private addNewProduct(product: Product): void {
    this.productService.addProduct(product)
      .subscribe({
        next: () => {
          this.isSaving = false;
          this.productService.displayTable$.next(true);
          this.productService.refreshTable$.next();
        }
      });
  }

  private editProduct(product: Product): void {
    this.productService.editProduct(product)
    .subscribe({
      next: () => {
        this.isSaving = false;
        this.productService.displayTable$.next(true);
        this.productService.refreshTable$.next();
      }
    });
  }

  public cancel(): void {
    this.productService.displayTable$.next(true);
  }

  public assignExpireDate(event: any): void {
    this.product!.expireDate = event.target.value;
    console.log(this.product!.expireDate);
  }

}
