// import { Component } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { Router } from '@angular/router';
// import { AuthService } from '../../core/services/auth.service';

// @Component({
//   selector: 'app-register',
//   templateUrl: './register.component.html',
//   styleUrls: ['./register.component.css'],
// })
// export class RegisterComponent {
//   registerForm: FormGroup;

//   constructor(
//     private fb: FormBuilder,
//     private authService: AuthService,
//     private router: Router
//   ) {
//     this.registerForm = this.fb.group({
//       email: ['', [Validators.required, Validators.email]],
//       password: ['', Validators.required],
//       nombre: ['', Validators.required],
//       telefono: [''],
//       direccion: [''],
//     });
//   }

//   async register() {
//     try {
//       // Registrar al usuario en Supabase Authentication
//       const { data, error } = await this.authService.supabase.auth.signUp({
//         email: this.registerForm.value.email,
//         password: this.registerForm.value.password,
//       });

//       if (error) {
//         console.error('Error al registrar el usuario en Auth:', error.message);
//         window.alert('Error al registrar el usuario.');
//         return;
//       }

//       console.log('Usuario registrado en Auth:', data);
//       window.alert('Usuario registrado correctamente.');
//       this.router.navigate(['/login']);

//       // Insertar información adicional en la base de datos
//       const { error: dbError } = await this.authService.supabase
//         .from('users')
//         .insert([
//           {
//             id: data.user?.id,
//             email: this.registerForm.value.email,
//             nombre: this.registerForm.value.nombre,
//             telefono: this.registerForm.value.telefono,
//             direccion: this.registerForm.value.direccion,
//             role: 'user',
//           },
//         ]);

//       if (dbError) {
//         console.error(
//           'Error al guardar datos del usuario en la DB:',
//           dbError.message
//         );
//       } else {
//         console.log('Datos adicionales guardados en la DB');
//       }
//     } catch (err) {
//       console.error('Error inesperado:', err);
//     }
//   }
// }

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  async register() {
    try {
      // Registrar al usuario en Supabase Authentication
      const { data, error } = await this.authService.supabase.auth.signUp({
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
      });

      if (error) {
        console.error('Error al registrar el usuario en Auth:', error.message);
        window.alert('Error al registrar el usuario.');
        return;
      }

      console.log('Usuario registrado en Auth:', data);
      window.alert(
        'Usuario registrado correctamente. Revisá tu correo para confirmar la cuenta.'
      );
      this.router.navigate(['/login']);
    } catch (err) {
      console.error('Error inesperado:', err);
      window.alert('Ocurrió un error inesperado.');
    }
  }
}
