import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EstudianteSSOPage } from './estudiante-sso.page';

describe('EstudianteSSOPage', () => {
  let component: EstudianteSSOPage;
  let fixture: ComponentFixture<EstudianteSSOPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EstudianteSSOPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
