import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-anomalias',
  templateUrl: './anomalias.page.html',
  styleUrls: ['./anomalias.page.scss'],
  standalone: false,
})
export class AnomaliasPage implements OnInit {
  quartosComAnomalias: { id: number; anomalias: { description: string; severity: string; color: string }[] }[] = [];
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
    // Refresh the anomalies list when the page is entered
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
          anomalias: quarto.anomalias.map((anomalia: any) => {
            const description = anomalia.description || 'Descrição não disponível';
            // Extract severity from description if it's in the format "... (Severidade: XYZ)"
            let severity = anomalia.severity || 'baixa';
            const match = description.match(/\(Severidade:\s*([^)]+)\)/);
            if (match) {
              severity = match[1].toLowerCase();
            }
            return {
              description,
              severity
            };
          })
        }));
      console.log('Processed quartosComAnomalias:', this.quartosComAnomalias);
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

  selectAnomalia(anomalia: any) {
    this.selectedAnomalia = anomalia;
  }
}