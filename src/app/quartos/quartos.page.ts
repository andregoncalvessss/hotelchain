import { Component } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { NavController } from '@ionic/angular'; // Importação para navegação

@Component({
  selector: 'app-quartos',
  templateUrl: './quartos.page.html',
  styleUrls: ['./quartos.page.scss'],
  standalone: false, 
})
export class QuartoPage {
  quartos: any[] = [
    { id: 101, estado: 'Livre', anomalias: 0, temperatura: 22 },
    { id: 102, estado: 'Ocupado', anomalias: 1, temperatura: 24 },
    { id: 103, estado: 'Manutenção', anomalias: 2, temperatura: 20 },
    { id: 104, estado: 'Livre', anomalias: 0, temperatura: 21 },
  ];

  quartoSelecionado: any = null;

  constructor(private storage: Storage, private navCtrl: NavController) {} // Adicionado NavController

  async ngOnInit() {
    await this.storage.create();
    const storedQuartos = await this.storage.get('quartos');
    if (storedQuartos) {
      this.quartos = storedQuartos;
    }
  }

  async onQuartoSelecionado(event: any) {
    this.quartoSelecionado = event.detail.value;
    console.log('Quarto selecionado:', this.quartoSelecionado);
    await this.storage.set('quartoSelecionado', this.quartoSelecionado);
  }

  async mudarEstadoOcupacao() {
    if (this.quartoSelecionado) {
      const estados = ['Livre', 'Ocupado', 'Manutenção'];
      const estadoAtual = this.quartoSelecionado.estado;
      const proximoEstado = estados[(estados.indexOf(estadoAtual) + 1) % estados.length];
      this.quartoSelecionado.estado = proximoEstado;

      console.log(`Estado do quarto ${this.quartoSelecionado.id} alterado para: ${proximoEstado}`);
      await this.storage.set('quartos', this.quartos);
    }
  }

  async alterarTemperatura(delta: number) {
    if (this.quartoSelecionado) {
      this.quartoSelecionado.temperatura += delta;
      if (this.quartoSelecionado.temperatura < 16) {
        this.quartoSelecionado.temperatura = 16; // Temperatura mínima
      } else if (this.quartoSelecionado.temperatura > 30) {
        this.quartoSelecionado.temperatura = 30; // Temperatura máxima
      }
      console.log('Nova temperatura:', this.quartoSelecionado.temperatura);
      await this.storage.set('quartos', this.quartos);
    }
  }

  voltarPagina() {
    this.navCtrl.back(); // Navega para a página anterior
  }
}