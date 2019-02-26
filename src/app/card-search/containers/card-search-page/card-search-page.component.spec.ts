import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardSearchPageComponent } from './card-search-page.component';

describe('CardSearchPageComponent', () => {
  let component: CardSearchPageComponent;
  let fixture: ComponentFixture<CardSearchPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardSearchPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardSearchPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
