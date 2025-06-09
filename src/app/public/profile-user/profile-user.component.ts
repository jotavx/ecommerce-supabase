import { Component, OnInit } from '@angular/core';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-user',
  templateUrl: './profile-user.component.html',
  styleUrl: './profile-user.component.css',
})
export class ProfileUserComponent implements OnInit {
  user: any;
  historialPedidos: any[] = [];
  loading = true;
  notUser: string | null = null;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  // ngOnInit(): void {
  //   this.authService.getUser().subscribe((user) => {
  //     if (user) {
  //       const userId = user.id;
  //       this.userService.getUserProfile(userId).subscribe({
  //         next: (response) => {
  //           this.user = response.data;
  //           this.loading = false;
  //         },
  //         error: (err) => {
  //           this.error = 'Error al obtener los datos del usuario.';
  //           this.loading = false;
  //         },
  //       });
  //     } else {
  //       this.error = 'No hay sesión iniciada.';
  //       this.loading = false;
  //     }
  //   });
  // }

  ngOnInit(): void {
    this.authService.getUser().subscribe((user) => {
      if (user) {
        const userId = user.id;

        // Obtener perfil del usuario
        this.userService.getUserProfile(userId).subscribe({
          next: (response) => {
            this.user = response.data;
            this.loading = false;
          },
          error: () => {
            this.notUser = 'Error al obtener los datos del usuario.';
            this.loading = false;
          },
        });

        // Obtener historial de pedidos
        this.userService.getHistorialPedidos(userId).then(({ data, error }) => {
          if (error) {
            console.error('Error al obtener historial:', error.message);
          } else {
            this.historialPedidos = data ?? [];
          }
        });
      } else {
        this.notUser = 'No hay sesión iniciada.';
        this.loading = false;
      }
    });
  }

  logout() {
    this.authService
      .logout()
      .then(() => {
        this.router.navigate(['/login']);
      })
      .catch((error) => {
        console.error('Error al desconectar al usuario:', error.message);
      });
  }
}
