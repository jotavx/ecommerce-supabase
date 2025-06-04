import { Injectable } from '@angular/core';
import { Session, SupabaseClient } from '@supabase/supabase-js';
import { SupabaseService } from './supabase.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public supabase: SupabaseClient;
  private userSubject = new BehaviorSubject<any>(null);

  constructor(private supabaseService: SupabaseService) {
    this.supabase = this.supabaseService.getClient();

    this.supabase.auth.onAuthStateChange((_, session) => {
      this.userSubject.next(session?.user || null);
    });
  }

  getUser(): Observable<any> {
    return this.userSubject.asObservable();
  }

  async login(email: string, password: string) {
    const {
      data: { user },
      error,
    } = await this.supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return user;
  }

  async logout(): Promise<void> {
    await this.supabase.auth.signOut();
  }

  async getSession(): Promise<Session | null> {
    const { data, error } = await this.supabase.auth.getSession();
    return error || !data.session ? null : data.session;
  }

  async isAuthenticated(): Promise<boolean> {
    const { data } = await this.supabase.auth.getSession();
    return !!data.session;
  }

  async signInWithGoogle() {
    const { error } = await this.supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/home`,
      },
    });
    if (error) console.error('Error en login con Google:', error.message);
  }
}
