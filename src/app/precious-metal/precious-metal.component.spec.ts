import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreciousMetalComponent } from './precious-metal.component';

describe('PreciousMetalComponent', () => {
  let component: PreciousMetalComponent;
  let fixture: ComponentFixture<PreciousMetalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreciousMetalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PreciousMetalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
