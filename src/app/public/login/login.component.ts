// import { Component } from '@angular/core';
// import { Router } from '@angular/router';
// import { AuthService } from '../../core/services/auth.service';

// @Component({
//   selector: 'app-login',
//   templateUrl: './login.component.html',
// })
// export class LoginComponent {
//   email = '';
//   password = '';
//   rememberMe = false;

//   constructor(private authService: AuthService, private router: Router) {}

//   async onLogin() {
//     try {
//       const user = await this.authService.login(this.email, this.password);
//       this.router.navigate(['/home']);
//     } catch (error) {
//       if (error instanceof Error) {
//         console.error('Error en el login:', error.message);
//       } else {
//         console.error('Error en el login:', error);
//       }
//     }
//   }
// }

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  email = '';
  password = '';
  rememberMe = false;

  constructor(private authService: AuthService, private router: Router) {}

  //Analizar si deberíamos agregar persistencia de sesión
  //Si es así, se puede usar el método `signInWithPassword` de Supabase con la opción `persistSession: true`

  async onLogin() {
    try {
      const { data, error } =
        await this.authService.supabase.auth.signInWithPassword({
          email: this.email,
          password: this.password,
        });

      if (error) {
        throw error;
      }

      const user = data?.user;

      if (!user) {
        throw new Error('No se pudo obtener el usuario autenticado');
      }

      // Verificar si tiene datos en la tabla "users"
      const { data: userData, error: fetchError } =
        await this.authService.supabase
          .from('users')
          .select('id')
          .eq('id', user.id)
          .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        // Cualquier error que no sea "no encontrado"
        console.error('Error consultando la tabla users:', fetchError.message);
        return;
      }

      if (userData) {
        this.router.navigate(['/home']);
      } else {
        this.router.navigate(['/complete-profile']);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error en el login:', error.message);
      } else {
        console.error('Error en el login:', error);
      }
    }
  }

  loginWithGoogle() {
    this.authService.signInWithGoogle();
  }
}
