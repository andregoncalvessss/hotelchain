import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-adicionar-anomalias',
  templateUrl: './adicionar-anomalias.page.html',
  styleUrls: ['./adicionar-anomalias.page.scss'],
  standalone: false,
})
export class AdicionarAnomaliasPage implements OnInit {
  quartos: { id: number; estado: string; anomalias: { description: string; severity: string; color: string }[] }[] = [];
  quartoSelecionado: number | null = null;
  severidadeSelecionada: string | null = null;
  descricaoAnomalia: string = '';

  constructor(
    private storage: Storage, 
    private router: Router,
    private alertController: AlertController,
    private navCtrl: NavController
  ) {}

  async ngOnInit() {
    await this.storage.create();
    const storedQuartos = await this.storage.get('quartos');
    if (storedQuartos && Array.isArray(storedQuartos)) {
      this.quartos = storedQuartos.map((quarto: any) => ({
        id: quarto.id,
        estado: quarto.estado || 'Desconhecido',
        anomalias: Array.isArray(quarto.anomalias)
          ? quarto.anomalias.map((anomalia: any) => ({
              description: anomalia.description,
              severity: anomalia.severity || 'baixa', // Default severity if missing
              color: anomalia.color || '#000000', // Default color if missing
            }))
          : [],
      }));
    }
  }

  async adicionarAnomalia() {
    if (!this.quartoSelecionado || !this.descricaoAnomalia || !this.severidadeSelecionada) {
      const alert = await this.alertController.create({
        header: 'Campos em falta',
        message: 'Por favor, preencha todos os campos obrigatórios.',
        buttons: ['OK'],
        cssClass: 'custom-alert'
      });

      await alert.present();
      return;
    }

    const normalizedSeverity = this.severidadeSelecionada.toLowerCase();
    const newAnomalia = {
      description: `${this.descricaoAnomalia} (Severidade: ${this.severidadeSelecionada})`,
      severity: normalizedSeverity,
      color: this.getSeverityColor(normalizedSeverity),
      assigned: false,
      timestamp: Date.now() // Adicionar timestamp para ordenação
    };

    try {
      const storedQuartos = await this.storage.get('quartos');
      if (storedQuartos) {
        const quarto = storedQuartos.find((q: any) => q.id === this.quartoSelecionado);
        if (quarto) {
          if (!Array.isArray(quarto.anomalias)) {
            quarto.anomalias = [];
          }
          // Adicionar a nova anomalia no início do array para aparecer primeiro
          quarto.anomalias.unshift(newAnomalia);
          await this.storage.set('quartos', storedQuartos);
          console.log('Anomalia adicionada com sucesso:', newAnomalia);

          // Navegar de volta para a página de anomalias
          this.router.navigate(['/tabs/anomalias']);
        } else {
          console.warn(`Quarto com ID ${this.quartoSelecionado} não encontrado.`);
        }
      }
    } catch (error) {
      console.error('Erro ao adicionar anomalia:', error);
    }
  }

  getSeverityColor(severity: string): string {
    switch (severity) {
      case 'baixa':
        return '#4CAF50'; // Green
      case 'media':
      case 'média':
        return '#FF9800'; // Orange
      case 'grave':
      case 'alta':
        return '#F44336'; // Red
      default:
        return '#000000'; // Black
    }
  }

  voltarPagina() {
    this.navCtrl.back();
  }
}
