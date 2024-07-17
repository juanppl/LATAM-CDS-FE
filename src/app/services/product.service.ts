import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, ReplaySubject, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import Swal from 'sweetalert2';
import { Product } from '../models/Product';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  public refreshTable$: Subject<void> = new Subject<void>();
  public selectedProduct$: ReplaySubject<Product | null> = new ReplaySubject<Product | null>(); 
  public displayTable$: Subject<boolean> = new Subject<boolean>();

  constructor(private http: HttpClient, private datePipe: DatePipe) { }

  public getListOfProducts(): Observable<Product[]> {
    const url = `${environment.api}Products/get-list-of-products`;
    return this.http.get<Product[]>(url).pipe(
      map((products: Product[]) => {
        products.forEach((product: Product) => {
          product.expireDateAsString = this.datePipe.transform(product.expireDate, 'YYYY-MM-dd');
          console.log(product.expireDateAsString);
        });
        return products;
      }),
      catchError((err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error when getting list of products',
          html: `${err.error.Message} ${err.error.Id}`
        });
        return of([]);
      })
    );
  }

  public addProduct(product: Product): Observable<Product | null> {
    const url = `${environment.api}Products/add-product`;
    return this.http.post<Product>(url, product).pipe(
      catchError((err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error when adding product',
          html: `${err.error.Message} ${err.error.Id}`
        });
        return of(null);
      })
    );
  }

  public editProduct(product: Product): Observable<Product> {
    const url = `${environment.api}Products/edit-product`;
    return this.http.put<Product>(url, product).pipe(
      catchError((err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error when editing product',
          html: `${err.error.Message} ${err.error.Id}`
        });
        return of();
      })
    );
  }

  public deleteProduct(productId: number): Observable<void | null> {
    const url = `${environment.api}Products/delete-product?id=${productId}`;
    return this.http.delete<void>(url).pipe(
      catchError((err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error when deleting product',
          html: `${err.error.Message} ${err.error.Id}`
        });
        return of(null);
      })
    );
  }

  private convertUTCDateToTZ(variable: Date) {
    if (variable) {
      variable = new Date(variable.toString());
      return new Date(
        variable.getUTCFullYear(),
        variable.getUTCMonth(),
        variable.getUTCDate()
      );
    }
    return variable;
  }
}
