import { Component } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { SupabaseService } from './services/supabase.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false // Definindo explicitamente como false
})
export class AppComponent {
  constructor(
    private storage: Storage,
    private router: Router,
    private platform: Platform,
    private supabaseService: SupabaseService // Adicionar o serviço
  ) {
    this.initializeApp();
  }

  async initializeApp() {
    await this.storage.create();
    await this.platform.ready();
    
    // Desativa a lógica de redirecionamento automático
    // para permitir navegação livre para todas as páginas
    
    // Opcional: se quiser manter o getstarted na primeira execução, pode usar:
    const hasSeenGetStarted = await this.storage.get('hasSeenGetStarted');
    if (!hasSeenGetStarted && window.location.pathname === '/') {
      this.router.navigateByUrl('/getstarted');
    }
  }
}
