import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-complete-profile',
  templateUrl: './complete-profile.component.html',
  styleUrl: './complete-profile.component.css',
})
export class CompleteProfileComponent {
  datosForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.datosForm = this.fb.group({
      nombre: ['', Validators.required],
      telefono: [''],
      direccion: [''],
    });
  }

  // async guardarDatos() {
  //   const {
  //     data: { user },
  //   } = await this.authService.supabase.auth.getUser();

  //   if (!user) {
  //     console.error('No hay usuario autenticado.');
  //     return;
  //   }

  //   const { error } = await this.authService.supabase.from('users').insert([
  //     {
  //       id: user.id,
  //       email: user.email,
  //       nombre: this.datosForm.value.nombre,
  //       telefono: this.datosForm.value.telefono,
  //       direccion: this.datosForm.value.direccion,
  //       role: 'user',
  //     },
  //   ]);

  //   if (error) {
  //     console.error('Error al guardar datos adicionales:', error.message);
  //     window.alert('No se pudieron guardar los datos.');
  //   } else {
  //     console.log('Datos adicionales guardados correctamente');
  //     this.router.navigate(['/home']); // o donde quieras redirigir
  //   }
  // }

  async guardarDatos() {
    // Validar formulario
    if (this.datosForm.invalid) {
      this.datosForm.markAllAsTouched();
      return;
    }

    // Obtener usuario autenticado
    const {
      data: { user },
    } = await this.authService.supabase.auth.getUser();

    if (!user) {
      console.error('No hay usuario autenticado.');
      return;
    }

    // Verificar si ya existe un perfil en la tabla 'users'
    const { data: existingUser, error: fetchError } =
      await this.authService.supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      // PGRST116: no rows found — significa que no hay usuario aún (lo ignoramos)
      console.error(
        'Error al verificar usuario existente:',
        fetchError.message
      );
      return;
    }

    if (existingUser) {
      console.log('El usuario ya tiene perfil, redirigiendo...');
      this.router.navigate(['/home']);
      return;
    }

    // Insertar nuevos datos
    const { error } = await this.authService.supabase.from('users').insert([
      {
        id: user.id,
        email: user.email,
        nombre: this.datosForm.value.nombre,
        telefono: this.datosForm.value.telefono,
        direccion: this.datosForm.value.direccion,
        role: 'user',
      },
    ]);

    if (error) {
      console.error('Error al guardar datos adicionales:', error.message);
      window.alert('No se pudieron guardar los datos.');
    } else {
      console.log('Datos adicionales guardados correctamente');
      this.router.navigate(['/home']);
    }
  }
}
