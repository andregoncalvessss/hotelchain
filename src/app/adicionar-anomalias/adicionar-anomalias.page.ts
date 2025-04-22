import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';

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

  constructor(private storage: Storage, private router: Router) {}

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
    if (this.quartoSelecionado && this.descricaoAnomalia && this.severidadeSelecionada) {
      const normalizedSeverity = this.severidadeSelecionada.toLowerCase();
      const newAnomalia = {
        description: `${this.descricaoAnomalia} (Severidade: ${this.severidadeSelecionada})`,
        severity: normalizedSeverity,
      };

      const storedQuartos = await this.storage.get('quartos');
      if (storedQuartos) {
        const quarto = storedQuartos.find((q: any) => q.id === this.quartoSelecionado);
        if (quarto) {
          if (!Array.isArray(quarto.anomalias)) {
            quarto.anomalias = [];
          }
          quarto.anomalias.push(newAnomalia);
          await this.storage.set('quartos', storedQuartos);
          console.log('Added anomaly:', newAnomalia);

          this.router.navigate(['/tabs/anomalias'], { replaceUrl: true });
        } else {
          console.warn(`Quarto com ID ${this.quartoSelecionado} não encontrado.`);
        }
      }
    } else {
      console.warn('Por favor, preencha todos os campos.');
    }
  }
}
