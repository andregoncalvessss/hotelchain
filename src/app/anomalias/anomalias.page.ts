import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-anomalias',
  templateUrl: './anomalias.page.html',
  styleUrls: ['./anomalias.page.scss'],
  standalone: false,
})
export class AnomaliasPage implements OnInit {
  quartosComAnomalias: { id: number; anomalias: { description: string; severity: string; color: string; assigned?: boolean }[] }[] = [];
  quartos: { id: number; estado: string; anomalias: { description: string }[] }[] = [];
  menuAberto: boolean = false;
  quartoSelecionado: number | null = null;
  severidadeSelecionada: string | null = null;
  descricaoAnomalia: string = '';
  selectedAnomalia: any = null;

  constructor(private storage: Storage) {}

  async ngOnInit() {
    await this.storage.create();
    await this.carregarQuartos();
    await this.carregarQuartosComAnomalias();
  }

  async ionViewWillEnter() {
    // Recarregar as anomalias ao entrar na página
    await this.carregarQuartosComAnomalias();
  }

  async carregarQuartos() {
    try {
      const storedQuartos = await this.storage.get('quartos');
      if (storedQuartos && Array.isArray(storedQuartos)) {
        this.quartos = storedQuartos.map((quarto: any) => ({
          id: quarto.id,
          estado: quarto.estado || 'Desconhecido',
          anomalias: Array.isArray(quarto.anomalias) ? quarto.anomalias : [],
        }));
        console.log('Quartos carregados:', this.quartos);
      } else {
        console.warn('Nenhum quarto encontrado no Storage ou formato inválido.');
        this.quartos = [];
      }
    } catch (error) {
      console.error('Erro ao carregar quartos:', error);
      this.quartos = [];
    }
  }

  async carregarQuartosComAnomalias() {
    const storedQuartos = await this.storage.get('quartos');
    if (storedQuartos && Array.isArray(storedQuartos)) {
      this.quartosComAnomalias = storedQuartos
        .filter((quarto: any) => Array.isArray(quarto.anomalias) && quarto.anomalias.length > 0)
        .map((quarto: any) => ({
          id: quarto.id,
          anomalias: quarto.anomalias.map((anomalia: any) => ({
            description: anomalia.description || 'Descrição não disponível',
            severity: anomalia.severity || 'baixa',
            assigned: anomalia.assigned || false,
            color: this.getSeverityColor(anomalia.severity || 'baixa'),
          })),
        }));
      console.log('Processed quartosComAnomalias:', this.quartosComAnomalias); // Debugging log
    } else {
      this.quartosComAnomalias = [];
    }
  }

  getSeverityColor(severity: string): string {
    console.log('Getting color for severity:', severity); // Debug log
    const normalizedSeverity = severity?.toLowerCase() || '';
    
    switch (normalizedSeverity) {
      case 'baixa':
        return '#008000'; // Green
      case 'media':
      case 'média':
        return '#FFA500'; // Orange
      case 'grave':
      case 'alta':
        return '#FF0000'; // Red
      default:
        console.log('Unrecognized severity:', severity);
        return '#000000'; // Black
    }
  }

  abrirMenuAdicionarAnomalia() {
    this.menuAberto = true;
  }

  fecharMenuAdicionarAnomalia() {
    this.menuAberto = false;
    this.quartoSelecionado = null;
    this.severidadeSelecionada = null;
    this.descricaoAnomalia = '';
  }

  async adicionarAnomalia() {
    if (this.quartoSelecionado && this.descricaoAnomalia) {
      const descricaoCompleta = `${this.descricaoAnomalia} (Severidade: ${this.severidadeSelecionada || 'Não especificada'})`;
      try {
        const storedQuartos = await this.storage.get('quartos');
        if (storedQuartos) {
          const quarto = storedQuartos.find((q: any) => q.id === this.quartoSelecionado);
          if (quarto) {
            if (!Array.isArray(quarto.anomalias)) {
              quarto.anomalias = [];
            }
            quarto.anomalias.push({ description: descricaoCompleta });
            await this.storage.set('quartos', storedQuartos);
            await this.carregarQuartosComAnomalias(); // Refresh the list
            this.quartoSelecionado = null;
            this.severidadeSelecionada = null;
            this.descricaoAnomalia = '';
            console.log(`Anomalia adicionada ao quarto ${this.quartoSelecionado}:`, descricaoCompleta);
          } else {
            console.warn(`Quarto com ID ${this.quartoSelecionado} não encontrado.`);
          }
        }
      } catch (error) {
        console.error('Erro ao adicionar anomalia:', error);
      }
    } else {
      console.warn('Por favor, preencha todos os campos.');
    }
  }

  async removerAnomalia(quartoId: number, anomalia: any) {
    const storedQuartos = await this.storage.get('quartos');
    if (storedQuartos) {
      const quarto = storedQuartos.find((q: any) => q.id === quartoId);
      if (quarto) {
        const index = quarto.anomalias.findIndex(
          (a: any) => a.description === anomalia.description && a.severity === anomalia.severity
        );

        if (index !== -1) {
          quarto.anomalias.splice(index, 1); // Remove the anomaly
          await this.storage.set('quartos', storedQuartos); // Save the updated state
          await this.carregarQuartosComAnomalias(); // Refresh the list
        }
      }
    }
  }

  async marcarFuncionarioParaResolver() {
    if (!this.selectedAnomalia) {
      console.warn('Nenhuma anomalia selecionada.');
      return;
    }

    const storedQuartos = await this.storage.get('quartos');
    if (storedQuartos) {
      const quarto = storedQuartos.find((q: any) =>
        q.anomalias.some((a: any) => a.description === this.selectedAnomalia.description)
      );

      if (quarto) {
        const anomalia = quarto.anomalias.find(
          (a: any) => a.description === this.selectedAnomalia.description
        );

        if (anomalia) {
          anomalia.assigned = true; // Mark the anomaly as assigned
          await this.storage.set('quartos', storedQuartos); // Save the updated state
          await this.carregarQuartosComAnomalias(); // Refresh the list
          console.log(`Funcionário assinalado para resolver a anomalia: ${anomalia.description}`);
        }
      }
    }
  }

  selectAnomalia(anomalia: any) {
    this.selectedAnomalia = anomalia;
  }
}