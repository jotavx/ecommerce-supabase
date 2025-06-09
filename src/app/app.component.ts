import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'ecommerce-supabase';
  showNavbar: boolean = true;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Suscribirse a los eventos de navegación para detectar cambios de ruta
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.checkCurrentRoute();
      });
  }

  checkCurrentRoute(): void {
    const currentRoute = this.router.url;
    if (currentRoute === '/login') {
      this.showNavbar = false;
    } else {
      this.showNavbar = true;
    }
  }
}
