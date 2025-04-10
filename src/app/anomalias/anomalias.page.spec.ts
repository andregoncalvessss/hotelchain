import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { anomaliasPage} from './anomalias.page';

describe('Tab3Page', () => {
  let component: anomaliasPage;
  let fixture: ComponentFixture<anomaliasPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [anomaliasPage],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(anomaliasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
