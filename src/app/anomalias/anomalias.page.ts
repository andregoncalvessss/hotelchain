import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-anomalias',
  templateUrl: './anomalias.page.html',
  styleUrls: ['./anomalias.page.scss'],
  standalone:false,
})
export class AnomaliasPage implements OnInit {
  quartosComAnomalias: any[] = [];

  constructor(
    private storage: Storage,
    private navCtrl: NavController
  ) {}

  async ngOnInit() {
    await this.storage.create();
    const storedQuartos = await this.storage.get('quartos');
    if (storedQuartos) {
      this.quartosComAnomalias = storedQuartos.filter(
        (q: any) => q.anomalias && q.anomalias.length > 0
      );
    }
    console.log('Quartos com anomalias:', this.quartosComAnomalias);
  }

  voltarPagina() {
    this.navCtrl.back();
  }

  assignFuncionario() {
    console.log('Funcionário atribuído para resolver anomalias');
    // Implementa a ação que pretendes realizar
  }
}
