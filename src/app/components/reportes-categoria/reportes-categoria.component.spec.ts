import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportesCategoriaComponent } from './reportes-categoria.component';

describe('ReportesCategoriaComponent', () => {
  let component: ReportesCategoriaComponent;
  let fixture: ComponentFixture<ReportesCategoriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportesCategoriaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReportesCategoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
