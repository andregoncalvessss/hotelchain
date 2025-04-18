import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { AnomaliasPage } from './anomalias.page';

describe('AnomaliasPage', () => {
  let component: AnomaliasPage;
  let fixture: ComponentFixture<AnomaliasPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AnomaliasPage],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(AnomaliasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
