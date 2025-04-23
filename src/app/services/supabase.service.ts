import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private _supabase: SupabaseClient;

  constructor() {
    const supabaseUrl = 'https://kexjwvailddocjwflfje.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtleGp3dmFpbGRkb2Nqd2ZsZmplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM1NDkzMTMsImV4cCI6MjA1OTEyNTMxM30.4e_urPDL8YUUWlu0ggE4twEZcCxQboV9O9YwkxBX0Gc'; // Substitua pela chave de função de serviço correta
    console.log('Using Supabase URL:', supabaseUrl);
    console.log('Using Supabase Key:', supabaseKey ? 'Key is set' : 'Key is missing');
    this._supabase = createClient(supabaseUrl, supabaseKey);
  }

  // Getter para acessar o cliente Supabase de fora
  get supabase(): SupabaseClient {
    return this._supabase;
  }

  // Método para registrar um usuário com informações completas
  async signUp(email: string, password: string, firstName?: string, lastName?: string, phoneNumber?: string) {
    console.log('Registering user with phone:', phoneNumber);

    // Registra o usuário no Supabase Auth
    const { data, error } = await this._supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          full_name: firstName && lastName ? `${firstName} ${lastName}` : undefined,
        }
      }
    });

    if (error) {
      console.error('Error during sign-up:', error.message);
      return { data, error };
    }

    // Atualiza o número de telefone no auth.users
    if (data && data.user && phoneNumber) {
      try {
        const { error: phoneError } = await this._supabase.auth.admin.updateUserById(data.user.id, {
          phone: phoneNumber
        });

        if (phoneError) {
          console.error('Error updating phone in auth.users:', phoneError.message);
        } else {
          console.log('Phone number successfully updated in auth.users.');
        }
      } catch (e) {
        console.error('Unexpected error while updating phone:', e);
      }
    }

    return { data, error };
  }

  // Método específico para verificação de telefone
  async updatePhoneNumber(userId: string, phoneNumber: string) {
    try {
      console.log('Tentando atualizar telefone para usuário:', userId, phoneNumber);
      
      // Tenta atualizar diretamente via Admin API
      // Este endpoint requer permissão de admin
      const { error } = await this._supabase.auth.admin.updateUserById(
        userId,
        { phone: phoneNumber }
      );
      
      if (error) {
        console.error('Erro ao atualizar telefone via admin API:', error);
        
        // Tentativa alternativa: salvar o telefone na tabela de perfis
        const { error: profileError } = await this._supabase
          .from('profiles')
          .upsert({
            id: userId,
            phone: phoneNumber,
            updated_at: new Date()
          });
          
        if (profileError) {
          console.error('Erro ao salvar telefone no perfil:', profileError);
          return false;
        }
      }
      
      return true;
    } catch (e) {
      console.error('Erro ao atualizar telefone:', e);
      return false;
    }
  }

  // Exemplo de método para login
  async signIn(email: string, password: string) {
    try {
      console.log('Tentando login com:', { email });
      const response = await this._supabase.auth.signInWithPassword({ email, password });
      console.log('Resposta de login:', response);
      return response;
    } catch (error) {
      console.error('Erro ao fazer login no Supabase:', error);
      throw error; // Re-lança o erro para ser tratado no componente
    }
  }

  // Método para verificar se há uma sessão ativa
  async getSession() {
    const { data } = await this._supabase.auth.getSession();
    return data.session;
  }

  // Método para atualizar o perfil do usuário
  async updateUserProfile(userId: string, data: { firstName: string, lastName: string, phoneNumber?: string }) {
    console.log('Atualizando perfil para usuário:', userId, data);
    
    const fullName = `${data.firstName} ${data.lastName}`;
    
    // Atualiza os metadados do usuário
    const authUpdate = await this.supabase.auth.updateUser({
      data: { 
        first_name: data.firstName,
        last_name: data.lastName,
        full_name: fullName,
        phone: data.phoneNumber
      }
    });
    
    // Atualiza a tabela profiles - Importante: o Supabase espera que o campo seja 'phone'
    const profileUpdate = await this.supabase
      .from('profiles')
      .upsert({ 
        id: userId,
        first_name: data.firstName,
        last_name: data.lastName, 
        full_name: fullName,
        phone: data.phoneNumber, // Este é o nome correto do campo no Supabase
        updated_at: new Date()
      }, { 
        onConflict: 'id'
      });
      
    return { authUpdate, profileUpdate };
  }

  // Exemplo de método para obter dados de uma tabela
  async getData(table: string) {
    return await this.supabase.from(table).select('*');
  }

  // Método para fazer logout
  async signOut() {
    return await this._supabase.auth.signOut();
  }

  // Método para fazer upload da imagem de perfil
  async uploadProfileImage(userId: string, imageDataUrl: string): Promise<string | null> {
    try {
      // Converter data URL para Blob
      const blob = this.dataURItoBlob(imageDataUrl);
      
      // Nome do arquivo no formato userId.extension
      const fileExt = imageDataUrl.split(';')[0].split('/')[1];
      const fileName = `${userId}.${fileExt}`;
      const filePath = `profile/${fileName}`;
      
      // Upload do arquivo para o bucket 'avatars'
      const { error: uploadError } = await this._supabase.storage
        .from('avatars')
        .upload(filePath, blob, {
          upsert: true, // Substitui se já existir
          contentType: `image/${fileExt}`
        });
        
      if (uploadError) {
        console.error('Erro no upload da imagem:', uploadError);
        return null;
      }
      
      // Obter URL pública da imagem
      const { data: { publicUrl } } = this._supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
        
      // Atualizar metadados do usuário com a URL da imagem
      await this._supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      });
      
      return publicUrl;
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      return null;
    }
  }

  // Método para obter a imagem de perfil do usuário
  async getProfileImage(userId: string): Promise<string | null> {
    try {
      // Tentar obter a URL da imagem dos metadados do usuário
      const { data: { user } } = await this._supabase.auth.getUser();
      if (user && user.user_metadata && user.user_metadata['avatar_url']) {
        return user.user_metadata['avatar_url'];
      }
      
      // Se não encontrar nos metadados, tentar obter diretamente do storage
      const { data } = await this._supabase.storage
        .from('avatars')
        .list(`profile/`, {
          search: userId
        });
        
      if (data && data.length > 0) {
        const file = data[0];
        const { data: { publicUrl } } = this._supabase.storage
          .from('avatars')
          .getPublicUrl(`profile/${file.name}`);
          
        return publicUrl;
      }
      
      // Se não encontrou nenhuma imagem, retornar a imagem padrão
      return 'assets/photos/avatar.jpg';
    } catch (error) {
      console.error('Erro ao obter imagem de perfil:', error);
      // Em caso de erro, também retornar a imagem padrão
      return 'assets/photos/avatar.jpg';
    }
  }

  // Auxiliar para converter Data URL para Blob
  private dataURItoBlob(dataURI: string): Blob {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    
    return new Blob([ab], { type: mimeString });
  }
}