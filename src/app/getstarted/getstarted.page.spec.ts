import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GetstartedPage } from './getstarted.page';

describe('GetstartedPage', () => {
  let component: GetstartedPage;
  let fixture: ComponentFixture<GetstartedPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GetstartedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
