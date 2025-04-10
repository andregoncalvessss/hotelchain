import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    // Substitua pelos valores do seu projeto Supabase
    const supabaseUrl = 'https://kexjwvailddocjwflfje.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtleGp3dmFpbGRkb2Nqd2ZsZmplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM1NDkzMTMsImV4cCI6MjA1OTEyNTMxM30.4e_urPDL8YUUWlu0ggE4twEZcCxQboV9O9YwkxBX0Gc';

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  // Exemplo de método para registrar um usuário
  async signUp(email: string, password: string) {
    return await this.supabase.auth.signUp({ email, password });
  }

  // Exemplo de método para login
  async signIn(email: string, password: string) {
    return await this.supabase.auth.signInWithPassword({ email, password });
  }

  // Exemplo de método para obter dados de uma tabela
  async getData(table: string) {
    return await this.supabase.from(table).select('*');
  }
}