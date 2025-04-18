import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdicionarAnomaliasPage } from './adicionar-anomalias.page';

describe('AdicionarAnomaliasPage', () => {
  let component: AdicionarAnomaliasPage;
  let fixture: ComponentFixture<AdicionarAnomaliasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AdicionarAnomaliasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
