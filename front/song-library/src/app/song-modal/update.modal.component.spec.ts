import { ComponentFixture, TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UpdateModalComponent } from './update-modal.component';
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
    <update-modal [song]="song"> </update-modal>
  `,
})
class WrapperComponent implements AfterViewInit {
  @ViewChild(UpdateModalComponent, { static: false }) appComponentRef!: UpdateModalComponent;
  modal!: TemplateRef<any>;
  song: Song = TestSong;
  constructor(private cdr: ChangeDetectorRef) {}
  ngAfterViewInit() {
    this.modal = this.appComponentRef.updateModal;
    this.cdr.detectChanges();
  }
}
describe('UpdateModalComponent', () => {
  let component: UpdateModalComponent;
  let fixture: ComponentFixture<WrapperComponent>;
  let wrapperComponent: WrapperComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateModalComponent, WrapperComponent ],
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

  it('should create an update button', () => {
    const compiled = fixture.nativeElement;
    const updateButton = compiled.querySelector('.btn-primary');
    expect(updateButton).toBeTruthy();
  });

  it('should call open() when the button is clicked', fakeAsync(() => {
    spyOn(component, 'open');
    let updateButton = fixture.nativeElement.querySelector('.table-button');
    updateButton.click();
    tick(100);
    fixture.detectChanges();
    expect(component.open).toHaveBeenCalled();
  }));

  it('should open an update modal when open() is called', () => {
    component.open(component.updateModal);
    fixture.detectChanges();
    let modalBody = document.body.querySelector('.modal-dialog .modal-title') as HTMLElement;
    expect(modalBody?.textContent?.trim()).toContain("Edit");
  });

  it('should populate with the Song to be updated', () => {
    component.open(component.updateModal);
    fixture.detectChanges();
    let modalBody = document.body.querySelector('.modal-dialog .modal-title') as HTMLElement;
    expect(modalBody?.textContent?.trim()).toContain("Song Title");
  });

  it('should create cancel and submit buttons', () => {
    component.open(component.updateModal);
    fixture.detectChanges();
    let cancelButton = document.body.querySelector('.modal-dialog .modal-footer .btn-secondary') as HTMLElement;
    let submitButton = document.body.querySelector('.modal-dialog .modal-footer .btn-primary') as HTMLElement;
    expect(cancelButton).toBeTruthy();
    expect(submitButton).toBeTruthy();
    expect(cancelButton?.textContent?.trim()).toBe("Cancel");
    expect(submitButton?.textContent?.trim()).toBe("Submit");
  });

  it('should close modal on cancel click', fakeAsync(() => {
    component.open(component.updateModal);
    tick(10);
    fixture.detectChanges();
    let cancelButton = document.body.querySelector('.modal-dialog .modal-footer .btn-secondary') as HTMLElement;
    cancelButton.click();
    tick(10);
    fixture.detectChanges();
    expect(component.closeResult).toBe("No update");
  }));

  it('should close modal and emit data on submit click', fakeAsync(() => {
    spyOn(component.updateSong, 'emit');
    component.open(component.updateModal);
    tick(10);
    fixture.detectChanges();
    let submitButton = document.body.querySelector('.modal-dialog .modal-footer .btn-primary') as HTMLElement;
    submitButton.click();
    tick(10);
    fixture.detectChanges();
    expect(component.closeResult).toBe("Yes click");
    expect(component.updateSong.emit).toHaveBeenCalled();
  }));

  it('should generate errors on invalid title input', fakeAsync(() => {
    component.open(component.updateModal);
    tick(10);
    fixture.detectChanges();
    component.songForm.patchValue({title: ''});
    let submit = document.body.querySelector('.modal-dialog .modal-footer .btn-primary') as HTMLButtonElement;
    tick(10);
    fixture.detectChanges();
    expect(submit.disabled).toBeTruthy();
  }));

  it('should enable submit with valid title input', fakeAsync(() => {
    component.open(component.updateModal);
    tick(10);
    fixture.detectChanges();
    component.songForm.patchValue({title: 'Updated Title'});
    let submit = document.body.querySelector('.modal-dialog .modal-footer .btn-primary') as HTMLButtonElement;
    tick(10);
    fixture.detectChanges();
    expect(submit.disabled).toBe(false);
  }));

  it('should generate errors on invalid artist input', fakeAsync(() => {
    component.open(component.updateModal);
    tick(10);
    fixture.detectChanges();
    component.songForm.patchValue({artist: ''});
    let submit = document.body.querySelector('.modal-dialog .modal-footer .btn-primary') as HTMLButtonElement;
    tick(10);
    fixture.detectChanges();
    expect(submit.disabled).toBeTruthy();
  }));

  it('should generate errors when artist is too long', fakeAsync(() => {
    component.open(component.updateModal);
    tick(10);
    fixture.detectChanges();
    let artist = '';
    for(let i = 0; i < 101; i++) artist+='a';
    component.songForm.patchValue({artist: artist});
    let submit = document.body.querySelector('.modal-dialog .modal-footer .btn-primary') as HTMLButtonElement;
    tick(10);
    fixture.detectChanges();
    expect(submit.disabled).toBeTruthy();
  }));

  it('should generate errors when title is too long', fakeAsync(() => {
    component.open(component.updateModal);
    tick(10);
    fixture.detectChanges();
    let title = '';
    for(let i = 0; i < 101; i++) title += 'b';
    component.songForm.patchValue({title: title});
    let submit = document.body.querySelector('.modal-dialog .modal-footer .btn-primary') as HTMLButtonElement;
    tick(10);
    fixture.detectChanges();
    expect(submit.disabled).toBeTruthy();
  }));

  it('should enable submit with valid artist input', fakeAsync(() => {
    component.open(component.updateModal);
    tick(10);
    fixture.detectChanges();
    component.songForm.patchValue({artist: 'Updated Artist'});
    let submit = document.body.querySelector('.modal-dialog .modal-footer .btn-primary') as HTMLButtonElement;
    tick(10);
    fixture.detectChanges();
    expect(submit.disabled).toBe(false);
  }));

  it('should generate errors on invalid release date input', fakeAsync(() => {
    component.open(component.updateModal);
    tick(10);
    fixture.detectChanges();
    component.songForm.patchValue({release_date: '99999-01-01'});
    let submit = document.body.querySelector('.modal-dialog .modal-footer .btn-primary') as HTMLButtonElement;
    tick(10);
    fixture.detectChanges();
    expect(submit.disabled).toBeTruthy();
  }));

  it('should enable submit with valid release date input', fakeAsync(() => {
    component.open(component.updateModal);
    tick(10);
    fixture.detectChanges();
    component.songForm.patchValue({release_date: '2019-01-06'});
    let submit = document.body.querySelector('.modal-dialog .modal-footer .btn-primary') as HTMLButtonElement;
    tick(10);
    fixture.detectChanges();
    expect(submit.disabled).toBe(false);
  }));

  it('should generate errors on negative price input', fakeAsync(() => {
    component.open(component.updateModal);
    tick(10);
    fixture.detectChanges();
    component.songForm.patchValue({price: -1});
    let submit = document.body.querySelector('.modal-dialog .modal-footer .btn-primary') as HTMLButtonElement;
    tick(10);
    fixture.detectChanges();
    expect(submit.disabled).toBeTruthy();
  }));

  it('should generate errors for price input above 1,000,000', fakeAsync(() => {
    component.open(component.updateModal);
    tick(10);
    fixture.detectChanges();
    component.songForm.patchValue({price: 1000001});
    let submit = document.body.querySelector('.modal-dialog .modal-footer .btn-primary') as HTMLButtonElement;
    tick(10);
    fixture.detectChanges();
    expect(submit.disabled).toBeTruthy();
  }));

  it('should enable submit with valid price input', fakeAsync(() => {
    component.open(component.updateModal);
    tick(10);
    fixture.detectChanges();
    component.songForm.patchValue({price: 49.95});
    let submit = document.body.querySelector('.modal-dialog .modal-footer .btn-primary') as HTMLButtonElement;
    tick(10);
    fixture.detectChanges();
    expect(submit.disabled).toBe(false);
  }));
});
