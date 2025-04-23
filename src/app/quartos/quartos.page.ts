import { Component } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-quartos',
  templateUrl: './quartos.page.html',
  styleUrls: ['./quartos.page.scss'],
  standalone: false,
})
export class QuartoPage {
  quartos: any[] = [
    { id: 101, estado: 'Livre', anomalias: [], temperatura: 22 },
    { id: 102, estado: 'Ocupado', anomalias: [], temperatura: 24 },
    { id: 103, estado: 'Manutenção', anomalias: [], temperatura: 20 },
    { id: 104, estado: 'Livre', anomalias: [], temperatura: 21 },
  ];

  quartoSelecionado: any = null;

  constructor(private storage: Storage, private navCtrl: NavController) {}

  async ngOnInit() {
    await this.storage.create();
    const storedQuartos = await this.storage.get('quartos');
    if (storedQuartos) {
      this.quartos = storedQuartos.map((quarto: any) => ({
        ...quarto,
        anomalias: quarto.anomalias.map((anomalia: any) => ({
          description: anomalia.description || 'Descrição não disponível',
        })),
      }));
    } else {
      await this.storage.set('quartos', this.quartos);
    }
  }

  async carregarAnomaliasDoQuartoSelecionado() {
    if (this.quartoSelecionado) {
      const anomalias = await this.getAnomaliasPorQuarto(this.quartoSelecionado.id);
      this.quartoSelecionado.anomalias = anomalias;
      console.log(`Anomalias do quarto ${this.quartoSelecionado.id}:`, anomalias);
    }
  }

  async onQuartoSelecionado(event: any) {
    this.quartoSelecionado = event.detail.value;
    console.log('Quarto selecionado:', this.quartoSelecionado);
    await this.carregarAnomaliasDoQuartoSelecionado();
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
        this.quartoSelecionado.temperatura = 16;
      } else if (this.quartoSelecionado.temperatura > 30) {
        this.quartoSelecionado.temperatura = 30;
      }
      console.log('Nova temperatura:', this.quartoSelecionado.temperatura);
      await this.storage.set('quartos', this.quartos);
    }
  }

  async corrigirDadosQuartos() {
    const storedQuartos = await this.storage.get('quartos');
    if (storedQuartos) {
      const quartosCorrigidos = storedQuartos.map((quarto: any) => ({
        ...quarto,
        anomalias: quarto.anomalias.map((anomalia: any) => ({
          description: anomalia.description || 'Descrição não disponível',
        })),
      }));
      await this.storage.set('quartos', quartosCorrigidos);
      console.log('Dados corrigidos no Storage:', quartosCorrigidos);
    }
  }

  async getAnomaliasPorQuarto(quartoId: number): Promise<any[]> {
    await this.storage.create();
    const storedQuartos = await this.storage.get('quartos');
    if (storedQuartos) {
      const quarto = storedQuartos.find((q: any) => q.id === quartoId);
      if (quarto && Array.isArray(quarto.anomalias)) {
        return quarto.anomalias.map((anomalia: any) => ({
          description: anomalia.description || 'Descrição não disponível',
        }));
      }
    }
    return []; // Return an empty array if no anomalies are found
  }

  async adicionarAnomalia(quartoId: number, descricao: string) {
    await this.storage.create();
    const storedQuartos = await this.storage.get('quartos');
    if (storedQuartos) {
      const quarto = storedQuartos.find((q: any) => q.id === quartoId);
      if (quarto) {
        if (!Array.isArray(quarto.anomalias)) {
          quarto.anomalias = [];
        }
        quarto.anomalias.push({ description: descricao });
        await this.storage.set('quartos', storedQuartos);

        // Update the local `quartos` array
        const localQuarto = this.quartos.find((q: any) => q.id === quartoId);
        if (localQuarto) {
          localQuarto.anomalias.push({ description: descricao });
        }

        console.log(`Anomalia adicionada ao quarto ${quartoId}:`, descricao);
      } else {
        console.warn(`Quarto com ID ${quartoId} não encontrado.`);
      }
    } else {
      console.warn('Nenhum quarto encontrado no Storage.');
    }
  }

  getAnomalias(): any[] {
    if (this.quartoSelecionado) {
      return this.quartoSelecionado.anomalias;
    }
    return [];
  }

  voltarPagina() {
    this.navCtrl.back();
  }
}