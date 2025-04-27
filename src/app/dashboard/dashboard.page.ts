import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';
import { Storage } from '@ionic/storage-angular';

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
  isMuted: boolean = false; // Nova propriedade para controlar o estado do sino

  // Estatísticas de Quartos
  quartosDisponiveis: number = 0;
  quartosOcupados: number = 0;
  quartosLimpeza: number = 0;
  quartosManutencao: number = 0;

  // Estatísticas de Anomalias
  anomaliasGraves: number = 0;
  anomaliasMedias: number = 0;
  anomaliasBaixas: number = 0;

  constructor(
    private router: Router,
    private supabaseService: SupabaseService,
    private storage: Storage
  ) {}

  async ngOnInit() {
    await this.storage.create();
    await this.loadUserData();
    await this.loadRoomStatuses();
    await this.loadAnomalyStatuses();
  }

  async ionViewWillEnter() {
    await this.loadUserData();
    await this.loadProfileImage();
    await this.loadRoomStatuses();
    await this.loadAnomalyStatuses();
  }

  private getRoomStorageKey(): string {
    // Use the same method as in quartos.page.ts to ensure consistency
    const userId = localStorage.getItem('userId') || this.userId || 'default';
    return `quartos_${userId}`;
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

        // Store userId in localStorage for consistent access across components
        if (this.userId) {
          localStorage.setItem('userId', this.userId);
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

  async loadRoomStatuses() {
    try {
      const storedQuartos = await this.storage.get(this.getRoomStorageKey());
      
      if (storedQuartos && Array.isArray(storedQuartos)) {
        // Reset counters
        this.quartosOcupados = 0;
        this.quartosDisponiveis = 0;
        this.quartosLimpeza = 0;
        this.quartosManutencao = 0;
        
        // Count rooms based on their estado
        storedQuartos.forEach((q: any) => {
          const estado = q.estado;
          
          if (estado === 'Livre') {
            this.quartosDisponiveis++;
          } else if (estado === 'Ocupado') {
            this.quartosOcupados++;
          } else if (estado === 'Manutenção') {
            // Map Manutenção to Limpeza in the dashboard
            this.quartosLimpeza++;
          }
        });
        
        console.log('Estatísticas de quartos carregadas:', {
          disponiveis: this.quartosDisponiveis,
          ocupados: this.quartosOcupados,
          limpeza: this.quartosLimpeza,
          manutencao: this.quartosManutencao
        });
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas dos quartos:', error);
    }
  }

  async loadAnomalyStatuses() {
    try {
      const storedQuartos = await this.storage.get('quartos');
      
      if (storedQuartos && Array.isArray(storedQuartos)) {
        let graves = 0;
        let medias = 0;
        let baixas = 0;
        
        storedQuartos.forEach((quarto: any) => {
          if (Array.isArray(quarto.anomalias)) {
            quarto.anomalias.forEach((anomalia: any) => {
              const severity = anomalia.severity?.toLowerCase() || '';
              if (severity.includes('grave') || severity.includes('alta')) {
                graves++;
              } else if (severity.includes('media') || severity.includes('média')) {
                medias++;
              } else if (severity.includes('baixa')) {
                baixas++;
              }
            });
          }
        });
        
        this.anomaliasGraves = graves;
        this.anomaliasMedias = medias;
        this.anomaliasBaixas = baixas;
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas das anomalias:', error);
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

  // Método para alternar o estado do sino
  toggleMute() {
    this.isMuted = !this.isMuted;
  }

  // Método para alternar o estado de notificação
  toggleNotificationMute() {
    this.isMuted = !this.isMuted;
    // You can add any additional notification muting logic here
    console.log('Notification mute toggled:', this.isMuted);
  }
}