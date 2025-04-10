import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';

@Component({
  standalone: false,
  selector: 'app-getstarted',
  templateUrl: './getstarted.page.html',
  styleUrls: ['./getstarted.page.scss'],
})
export class GetstartedPage implements OnInit {

  constructor(
    private router: Router,
    private storage: Storage
  ) { }

  async ngOnInit() {
    // Se o usuário tentar voltar manualmente após já ter visto:
    const isSeen = await this.storage.get('onboardingSeen');
    if (isSeen) {
      // Redireciona de volta às tabs
      this.router.navigateByUrl('/tabs/home', { replaceUrl: true });
    }
  }

  async comecar() {
    // Grava no Storage que o user já viu essa tela
    await this.storage.set('onboardingSeen', true);
    // Navega para /tabs/home, removendo esse "GetStarted" do histórico
    this.router.navigateByUrl('/tabs/home', { replaceUrl: true });
  }
}
