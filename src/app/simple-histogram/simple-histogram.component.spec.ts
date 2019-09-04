import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleHistogramComponent } from './simple-histogram.component';

describe('SimpleHistogramComponent', () => {
  let component: SimpleHistogramComponent;
  let fixture: ComponentFixture<SimpleHistogramComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimpleHistogramComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleHistogramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
