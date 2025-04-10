import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { QuartoPage } from './quartos.page';

describe('quartosPage', () => {
  let component: QuartoPage;
  let fixture: ComponentFixture<QuartoPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuartoPage],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(QuartoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
