import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebhookPreviewComponent } from './webhook-preview.component';

describe('WebhookPreviewComponent', () => {
  let component: WebhookPreviewComponent;
  let fixture: ComponentFixture<WebhookPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebhookPreviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebhookPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
