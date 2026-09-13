import {
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';

import {
  Product,
  ProductsService,
} from '../../core/services/products';

import { Navbar } from '../../layout/navbar/navbar';

@Component({
  selector: 'app-products',
  imports: [Navbar],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products implements OnInit {

  private readonly productsService = inject(ProductsService);

  readonly products = signal<Product[]>([]);
  readonly loading = signal(false);
  readonly error = signal('');

  // Signal para guardar el producto seleccionado en el modal
  readonly selectedProduct = signal<Product | null>(null);

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading.set(true);

    this.productsService.getAll().subscribe({
      next: (products) => {
        // Excluir productos de cafetería por nombre
        const tequilasOnly = products.filter((product) => {
          const name = product.nombre.toLowerCase().trim();
          return !['café americano', 'cafe americano', 'capuchino', 'croissant'].includes(name);
        });

        this.products.set(tequilasOnly);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar los productos');
        this.loading.set(false);
      },
    });
  }

  // Métodos para controlar el modal
  openDetail(product: Product): void {
    this.selectedProduct.set(product);
  }

  closeDetail(): void {
    this.selectedProduct.set(null);
  }
}