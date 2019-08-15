import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowchartTestComponent } from './flowchart-test.component';

describe('FlowchartTestComponent', () => {
  let component: FlowchartTestComponent;
  let fixture: ComponentFixture<FlowchartTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlowchartTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlowchartTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
