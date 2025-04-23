import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { SupabaseService } from '../services/supabase.service';

@Component({
  standalone: false,
  selector: 'app-getstarted',
  templateUrl: './getstarted.page.html',
  styleUrls: ['./getstarted.page.scss'],
})
export class GetstartedPage implements OnInit {

  constructor(
    private router: Router,
    private storage: Storage,
    private supabaseService: SupabaseService
  ) { }

  async ngOnInit() {
    await this.storage.create();
    
    // Comentado o código para evitar redirecionamento automático
    // const hasSeenGetStarted = await this.storage.get('hasSeenGetStarted');
    
    // if (hasSeenGetStarted) {
    //   const session = await this.supabaseService.getSession();
    //   
    //   if (session) {
    //     this.router.navigateByUrl('/tabs/dashboard', { replaceUrl: true });
    //   } else {
    //     this.router.navigateByUrl('/login', { replaceUrl: true });
    //   }
    // }
  }

  async comecar() {
    // Marcar que o usuário já viu a tela inicial
    await this.storage.set('hasSeenGetStarted', true);
    
    // Verificar se o usuário já está logado
    const session = await this.supabaseService.getSession();
    
    if (session) {
      // Se estiver logado, ir para o dashboard com tabs
      this.router.navigateByUrl('/tabs/dashboard', { replaceUrl: true });
    } else {
      // Se não estiver logado, ir para a página de login
      this.router.navigateByUrl('/login', { replaceUrl: true });
    }
  }
}
