import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../core/services/auth';
import { Navbar } from '../../layout/navbar/navbar';

@Component({
  selector: 'app-home',
  imports: [Navbar],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  goToProducts(): void {
    this.router.navigate(['/products']);
  }
}