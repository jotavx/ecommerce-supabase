import { Component } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  user: any;
  notUser: boolean = true; // true si no hay sesión
  loading = true;

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.getUser().subscribe((user) => {
      if (user) {
        const userId = user.id;

        this.userService.getUserProfile(userId).subscribe({
          next: (response) => {
            this.user = response.data;
            this.notUser = false; // hay sesión
            this.loading = false;
          },
          error: () => {
            this.notUser = true;
            this.loading = false;
          },
        });
      } else {
        this.notUser = true; // no hay sesión
        this.loading = false;
      }
    });
  }
}
