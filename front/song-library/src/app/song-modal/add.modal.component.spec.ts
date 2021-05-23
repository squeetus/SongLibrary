import { ComponentFixture, TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AddModalComponent } from './add-modal.component';
import { ChangeDetectorRef, ViewChild, Component, OnInit, AfterViewInit, TemplateRef } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Song } from './../song';

const TestSong = {
    id: 2,
    title: "Song Title",
    artist: "An Artist",
    release_date: "2019-01-01",
    price: 14.99
};

/*
<div id="modalContainer">
  <ng-container *ngTemplateOutlet="modal"> </ng-container>
</div>
*/
@Component({
  template: `
    <add-modal [song]="song"> </add-modal>
  `,
})
class WrapperComponent implements AfterViewInit {
  @ViewChild(AddModalComponent, { static: false }) appComponentRef!:AddModalComponent;
  modal!: TemplateRef<any>;
  song: Song = TestSong;
  constructor(private cdr: ChangeDetectorRef) {}
  ngAfterViewInit() {
    this.modal = this.appComponentRef.addModal;
    this.cdr.detectChanges();
  }
}
describe('AddModalComponent', () => {
  let component: AddModalComponent;
  let fixture: ComponentFixture<WrapperComponent>;
  let wrapperComponent: WrapperComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddModalComponent, WrapperComponent ],
      imports: [ ReactiveFormsModule ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WrapperComponent);
    wrapperComponent = fixture.debugElement.componentInstance;
    fixture.detectChanges();
    component = wrapperComponent.appComponentRef;
    fixture.detectChanges();
  });

  afterEach(() => {
     document.body.querySelector('.modal-dialog')?.remove();
  });

  it('should be created', () => {
    expect(wrapperComponent).toBeTruthy();
    expect(component).toBeTruthy();
  });

  it('should create an add button', () => {
    const compiled = fixture.nativeElement;
    const addButton = compiled.querySelector('.btn-primary');
    expect(addButton).toBeTruthy();
  });

  it('should call open() when the button is clicked', fakeAsync(() => {
    spyOn(component, 'open');
    let addButton = fixture.nativeElement.querySelector('.btn-primary');
    addButton.click();
    tick(100);
    fixture.detectChanges();
    expect(component.open).toHaveBeenCalled();
  }));

  it('should open an add modal when open() is called', () => {
    component.open(component.addModal);
    fixture.detectChanges();
    let modalBody = document.body.querySelector('.modal-dialog .modal-title') as HTMLElement;
    expect(modalBody?.textContent?.trim()).toContain("Add");
  });

  it('should create cancel and submit buttons', () => {
    component.open(component.addModal);
    fixture.detectChanges();
    let cancelButton = document.body.querySelector('.modal-dialog .modal-footer .btn-secondary') as HTMLElement;
    let submitButton = document.body.querySelector('.modal-dialog .modal-footer .btn-primary') as HTMLElement;
    expect(cancelButton).toBeTruthy();
    expect(submitButton).toBeTruthy();
    expect(cancelButton?.textContent?.trim()).toBe("Cancel");
    expect(submitButton?.textContent?.trim()).toBe("Submit");
  });

  it('should close modal on cancel click', fakeAsync(() => {
    component.open(component.addModal);
    tick(10);
    fixture.detectChanges();
    let cancelButton = document.body.querySelector('.modal-dialog .modal-footer .btn-secondary') as HTMLElement;
    cancelButton.click();
    tick(10);
    fixture.detectChanges();
    expect(component.closeResult).toBe("No add");
  }));

  it('should close modal and emit data on submit click', fakeAsync(() => {
    spyOn(component.addSong, 'emit');
    component.open(component.addModal);
    tick(10);
    fixture.detectChanges();
    component.songForm.patchValue(TestSong);
    let submitButton = document.body.querySelector('.modal-dialog .modal-footer .btn-primary') as HTMLElement;
    tick(10);
    fixture.detectChanges();
    submitButton.click();
    tick(10);
    fixture.detectChanges();
    expect(component.closeResult).toBe("Yes click");
    expect(component.addSong.emit).toHaveBeenCalled();
  }));

  it('should generate errors on invalid title input', fakeAsync(() => {
    component.open(component.addModal);
    tick(10);
    fixture.detectChanges();
    component.songForm.patchValue({title: ''});
    let submit = document.body.querySelector('.modal-dialog .modal-footer .btn-primary') as HTMLButtonElement;
    tick(10);
    fixture.detectChanges();
    expect(submit.disabled).toBeTruthy();
  }));

  it('should generate errors on invalid artist input', fakeAsync(() => {
    component.open(component.addModal);
    tick(10);
    fixture.detectChanges();
    component.songForm.patchValue({artist: ''});
    let submit = document.body.querySelector('.modal-dialog .modal-footer .btn-primary') as HTMLButtonElement;
    tick(10);
    fixture.detectChanges();
    expect(submit.disabled).toBeTruthy();
  }));

  it('should generate errors on invalid release date input', fakeAsync(() => {
    component.open(component.addModal);
    tick(10);
    fixture.detectChanges();
    component.songForm.patchValue({release_date: '99999-01-01'});
    let submit = document.body.querySelector('.modal-dialog .modal-footer .btn-primary') as HTMLButtonElement;
    tick(10);
    fixture.detectChanges();
    expect(submit.disabled).toBeTruthy();
  }));

  it('should generate errors on negative price input', fakeAsync(() => {
    component.open(component.addModal);
    tick(10);
    fixture.detectChanges();
    component.songForm.patchValue({price: -1});
    let submit = document.body.querySelector('.modal-dialog .modal-footer .btn-primary') as HTMLButtonElement;
    tick(10);
    fixture.detectChanges();
    expect(submit.disabled).toBeTruthy();
  }));

  it('should generate errors for price input above 1,000,000', fakeAsync(() => {
    component.open(component.addModal);
    tick(10);
    fixture.detectChanges();
    component.songForm.patchValue({price: 1000001});
    let submit = document.body.querySelector('.modal-dialog .modal-footer .btn-primary') as HTMLButtonElement;
    tick(10);
    fixture.detectChanges();
    expect(submit.disabled).toBeTruthy();
  }));

  it('should enable submit only when all inputs are valid', fakeAsync(() => {
    component.open(component.addModal);
    tick(10);
    fixture.detectChanges();
    component.songForm.patchValue({title: "One New Title"});
    component.songForm.patchValue({artist: "One New Artist"});
    component.songForm.patchValue({release_date: "2021-05-26"});
    component.songForm.patchValue({price: 49.95});
    let submit = document.body.querySelector('.modal-dialog .modal-footer .btn-primary') as HTMLButtonElement;
    tick(10);
    fixture.detectChanges();
    expect(submit.disabled).toBe(false);
  }));
});
