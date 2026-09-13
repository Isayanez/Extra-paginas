import {
  HttpClient,
  HttpParams,
} from '@angular/common/http';

import {
  inject,
  Injectable,
} from '@angular/core';

export interface Product {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
  description?: string;
  image?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProductsService {

  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/api/products';

  getAll() {
    const params = new HttpParams()
      .set('limit', 50)
      .set('offset', 0);

    return this.http.get<Product[]>(
      this.apiUrl,
      { params },
    );
  }
}