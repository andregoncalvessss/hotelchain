import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';
import { Storage } from '@ionic/storage-angular';
import { ActionSheetController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: false,
})
export class PerfilPage implements OnInit {
  userName: string = 'Utilizador';
  userEmail: string = '';
  profileImage: string = 'assets/photos/avatar.jpg'; // Atualizado para usar a imagem existente
  userId: string = '';
  
  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(
    private router: Router,
    private supabaseService: SupabaseService,
    private storage: Storage,
    private actionSheetCtrl: ActionSheetController,
    private toastCtrl: ToastController
  ) { }

  async ngOnInit() {
    await this.loadUserData();
  }

  async loadUserData() {
    try {
      const session = await this.supabaseService.getSession();
      if (session && session.user) {
        this.userId = session.user.id;
        this.userEmail = session.user.email || '';
        
        const userData = session.user.user_metadata;
        
        if (userData) {
          if (userData['full_name']) {
            this.userName = userData['full_name'];
          } else if (userData['first_name'] && userData['last_name']) {
            this.userName = `${userData['first_name']} ${userData['last_name']}`;
          } else if (userData['first_name']) {
            this.userName = userData['first_name'];
          }
        }
        
        // Carregar imagem de perfil do Supabase Storage
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

  async changeProfileImage() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Alterar foto de perfil',
      buttons: [
        {
          text: 'Escolher da galeria',
          icon: 'image',
          handler: () => {
            this.fileInput.nativeElement.click();
          }
        },
        {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      if (!file.type.includes('image')) {
        this.presentToast('Por favor, selecione uma imagem.', 'warning');
        return;
      }
      
      try {
        // Mostrar loading
        const toast = await this.toastCtrl.create({
          message: 'A atualizar foto de perfil...',
          duration: 3000
        });
        await toast.present();
        
        // Converter arquivo para DataURL
        const reader = new FileReader();
        reader.onload = async (e) => {
          const dataUrl = e.target?.result as string;
          
          // Enviar para o Supabase
          const result = await this.supabaseService.uploadProfileImage(
            this.userId, 
            dataUrl
          );
          
          if (result) {
            this.profileImage = result;
            this.presentToast('Foto de perfil atualizada com sucesso!');
          } else {
            this.presentToast('Erro ao atualizar foto de perfil.', 'danger');
          }
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('Erro ao processar imagem:', error);
        this.presentToast('Erro ao processar imagem.', 'danger');
      }
    }
  }

  async presentToast(message: string, color: string = 'success') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'bottom',
      color
    });
    await toast.present();
  }

  async logout() {
    // Fazer logout no Supabase
    await this.supabaseService.signOut();
    
    // Navegar para a página de login
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}
