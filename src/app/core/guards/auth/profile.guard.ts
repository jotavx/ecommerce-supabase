import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../../services/auth.service';

export const profileGuard: CanActivateFn = async (): Promise<
  boolean | UrlTree
> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // 1️⃣ Obtener usuario autenticado
  const {
    data: { user },
  } = await authService.supabase.auth.getUser();

  if (!user) {
    // No autenticado: redirigir a login
    return router.createUrlTree(['/login']);
  }

  // 2️⃣ Verificar si existe el perfil en 'users'
  const { data: existingUser, error } = await authService.supabase
    .from('users')
    .select('id')
    .eq('id', user.id)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error al verificar perfil:', error.message);
    // Podrías devolver false o redirigir a un error page
    return router.createUrlTree(['/login']);
  }

  // 3️⃣ Permitir o redirigir según exista el perfil
  return existingUser ? true : router.createUrlTree(['/complete-profile']);
};
