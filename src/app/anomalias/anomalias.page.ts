import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-anomalias',
  templateUrl: './anomalias.page.html',
  styleUrls: ['./anomalias.page.scss'],
  standalone: false,
})
export class AnomaliasPage implements OnInit {
  quartosComAnomalias: { id: number; anomalias: { description: string; severity: string; color: string; assigned?: boolean; timestamp?: number }[] }[] = [];
  quartos: { id: number; estado: string; anomalias: { description: string }[] }[] = [];
  menuAberto: boolean = false;
  quartoSelecionado: number | null = null;
  severidadeSelecionada: string | null = null;
  descricaoAnomalia: string = '';
  selectedAnomalia: any = null;
  selectedQuarto: any = null;

  constructor(
    private storage: Storage, 
    private navCtrl: NavController,
    private router: Router
  ) {}

  async ngOnInit() {
    await this.storage.create();

    // Remover a limpeza automática das anomalias existentes na inicialização
    // Apenas carregar os dados atuais
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
          anomalias: quarto.anomalias
            .map((anomalia: any) => {
              // Determine the color based on severity
              let color;
              const severity = anomalia.severity || 'baixa';
              
              if (severity === 'grave') {
                color = '#F44336'; // Red for serious anomalies
              } else if (severity === 'media') {
                color = '#FF9800'; // Orange for medium anomalies
              } else {
                color = '#4CAF50'; // Green for minor anomalies
              }
              
              return {
                description: anomalia.description || 'Descrição não disponível',
                severity: severity,
                color: color,
                assigned: anomalia.assigned || false,
                timestamp: anomalia.timestamp || Date.now() // Adicionar timestamp se não existir
              };
            })
            // Ordenar anomalias do mais recente para o mais antigo
            .sort((a: any, b: any) => (b.timestamp || 0) - (a.timestamp || 0))
        }));
      
      // Ordenar quartos com anomalias mais recentes primeiro
      this.quartosComAnomalias.sort((a: any, b: any) => {
        const timestampA = a.anomalias.length > 0 ? a.anomalias[0].timestamp || 0 : 0;
        const timestampB = b.anomalias.length > 0 ? b.anomalias[0].timestamp || 0 : 0;
        return timestampB - timestampA;
      });
      
      console.log('Quartos com anomalias ordenados por mais recentes:', this.quartosComAnomalias);
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

  navegarParaAdicionarAnomalias() {
    this.router.navigate(['/adicionar-anomalias']);
    console.log('Navegando para a página de adicionar anomalias');
  }

  async removerAnomalia(quartoId: number, anomaliaParaRemover: any) {
    // Stop event propagation to prevent card selection
    event?.stopPropagation();
    
    try {
      const storedQuartos = await this.storage.get('quartos');
      if (storedQuartos && Array.isArray(storedQuartos)) {
        // Find the matching room
        const quarto = storedQuartos.find((q: any) => q.id === quartoId);
        if (quarto && Array.isArray(quarto.anomalias)) {
          // Filter out the anomaly to remove
          quarto.anomalias = quarto.anomalias.filter((anomalia: any) => 
            anomalia.description !== anomaliaParaRemover.description);
          
          // Save updated data back to storage
          await this.storage.set('quartos', storedQuartos);
          
          // Update local state
          this.quartosComAnomalias = this.quartosComAnomalias.map(q => {
            if (q.id === quartoId) {
              return {
                ...q,
                anomalias: q.anomalias.filter(a => 
                  a.description !== anomaliaParaRemover.description)
              };
            }
            return q;
          });
          
          // Remove any rooms that no longer have anomalies
          this.quartosComAnomalias = this.quartosComAnomalias.filter(
            q => q.anomalias.length > 0
          );
          
          console.log(`Anomalia removida do quarto ${quartoId}`);
        }
      }
    } catch (error) {
      console.error('Erro ao remover anomalia:', error);
    }
  }

  // Versão mais robusta da função temFuncionarioAssinalado
  temFuncionarioAssinalado(quarto: any): boolean {
    if (!quarto || !quarto.anomalias || !Array.isArray(quarto.anomalias) || quarto.anomalias.length === 0) {
      return false;
    }
    
    return quarto.anomalias.some((a: any) => a.assigned === true);
  }

  // Método mais robusto para assinalar funcionário
  async marcarFuncionarioParaResolver() {
    console.log('Método marcarFuncionarioParaResolver chamado');
    
    if (!this.selectedQuarto) {
      console.warn('Nenhum quarto selecionado para assinalar funcionário');
      return;
    }

    console.log('Quarto para assinalar funcionário:', this.selectedQuarto);

    try {
      const storedQuartos = await this.storage.get('quartos');
      if (!storedQuartos || !Array.isArray(storedQuartos)) {
        console.error('Dados de quartos não encontrados ou inválidos');
        return;
      }

      const quartoIndex = storedQuartos.findIndex((q: any) => q.id === this.selectedQuarto.id);
      console.log('Índice do quarto encontrado:', quartoIndex);

      if (quartoIndex === -1) {
        console.error('Quarto não encontrado no storage');
        return;
      }

      // Marcar todas as anomalias como assigned
      storedQuartos[quartoIndex].anomalias.forEach((anomalia: any) => {
        anomalia.assigned = true;
      });
      
      // Salvar de volta no storage
      await this.storage.set('quartos', storedQuartos);
      console.log('Funcionário assinalado para resolver anomalias no quarto:', this.selectedQuarto.id);
      
      // Atualizar UI
      this.quartosComAnomalias = this.quartosComAnomalias.map(quarto => {
        if (quarto.id === this.selectedQuarto.id) {
          return {
            ...quarto,
            anomalias: quarto.anomalias.map(anomalia => ({
              ...anomalia,
              assigned: true
            }))
          };
        }
        return quarto;
      });
      
      // Recalcular estado do botão
      this.selectQuarto(this.selectedQuarto);
    } catch (error) {
      console.error('Erro ao marcar funcionário:', error);
    }
  }

  // Método mais robusto para selecionar quarto
  selectQuarto(quarto: any) {
    console.log('Quarto clicado:', quarto);
    
    if (this.selectedQuarto === quarto) {
      console.log('Quarto deselecionado');
      this.selectedQuarto = null;
    } else {
      console.log('Novo quarto selecionado');
      this.selectedQuarto = quarto;
    }
    
    // Debug para ver se as condições para mostrar o botão estão corretas
    console.log('Quarto selecionado:', this.selectedQuarto);
    console.log('Tem funcionário assinalado?', this.selectedQuarto ? this.temFuncionarioAssinalado(this.selectedQuarto) : false);
    console.log('Deve mostrar botão?', this.selectedQuarto && !this.temFuncionarioAssinalado(this.selectedQuarto));
  }

  selectAnomalia(anomalia: any) {
    this.selectedAnomalia = anomalia;
  }

  voltarPagina() {
    this.navCtrl.back();
  }
}