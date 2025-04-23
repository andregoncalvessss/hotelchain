import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: false
})
export class DashboardPage implements OnInit {
  userName: string = 'Utilizador';
  profileImage: string = 'assets/photos/avatar.jpg'; // Atualizado para usar a imagem existente
  userId: string = '';

  constructor(
    private router: Router,
    private supabaseService: SupabaseService
  ) {}

  async ngOnInit() {
    await this.loadUserData();
  }

  async loadUserData() {
    try {
      const session = await this.supabaseService.getSession();
      if (session && session.user) {
        this.userId = session.user.id;

        // Obter metadados do usuário que contém o nome
        const userData = session.user.user_metadata;
        
        if (userData) {
          // Verificar diferentes formas como o nome pode estar armazenado
          if (userData['full_name']) {
            this.userName = userData['full_name'];
          } else if (userData['first_name'] && userData['last_name']) {
            this.userName = `${userData['first_name']} ${userData['last_name']}`;
          } else if (userData['first_name']) {
            this.userName = userData['first_name'];
          }
        }

        // Carregar imagem de perfil
        await this.loadProfileImage();
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
    }
  }

  async loadProfileImage() {
    try {
      if (this.userId) {
        const profileImage = await this.supabaseService.getProfileImage(this.userId);
        if (profileImage) {
          this.profileImage = profileImage;
        }
      }
    } catch (error) {
      console.error('Erro ao carregar imagem de perfil:', error);
    }
  }

  gerirQuartos() {
    // Navega para a página de quartos
    this.router.navigateByUrl('/tabs/quartos');
  }

  gerirAnomalias() {
    // Navega para a página de anomalias
    this.router.navigateByUrl('/tabs/anomalias');
  }
}