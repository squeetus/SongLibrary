import { ComponentFixture, TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DeleteModalComponent } from './delete-modal.component';
import { ChangeDetectorRef, ViewChild, Component, OnInit, AfterViewInit, TemplateRef } from '@angular/core';
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
    <delete-modal [song]="song"> </delete-modal>
  `,
})
class WrapperComponent implements AfterViewInit {
  @ViewChild(DeleteModalComponent, { static: false }) appComponentRef!: DeleteModalComponent;
  modal!: TemplateRef<any>;
  song: Song = TestSong;
  constructor(private cdr: ChangeDetectorRef) {}
  ngAfterViewInit() {
    this.modal = this.appComponentRef.deleteModal;
    this.cdr.detectChanges();
  }
}
describe('DeleteModalComponent', () => {
  let component: DeleteModalComponent;
  let fixture: ComponentFixture<WrapperComponent>;
  let wrapperComponent: WrapperComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteModalComponent, WrapperComponent ]
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

  it('should create a delete button', () => {
    const compiled = fixture.nativeElement;
    const deleteButton = compiled.querySelector('.btn-danger');
    expect(deleteButton).toBeTruthy();
  });

  it('should call open() when the button is clicked', fakeAsync(() => {
    spyOn(component, 'open');
    let deleteButton = fixture.nativeElement.querySelector('.table-button');
    deleteButton.click();
    tick(100);
    fixture.detectChanges();
    expect(component.open).toHaveBeenCalled();
  }));

  it('should open a delete modal when open() is called', () => {
    component.open(component.deleteModal);
    fixture.detectChanges();
    let modalBody = document.body.querySelector('.modal-dialog .modal-body') as HTMLElement;
    expect(modalBody?.textContent?.trim()).toContain("delete this song");
  });

  it('should populate with the Song to be deleted', () => {
    component.open(component.deleteModal);
    fixture.detectChanges();
    let modalBody = document.body.querySelector('.modal-dialog .modal-body span') as HTMLElement;
    expect(modalBody?.textContent?.trim()).toBe("Song Title");
  });

  it('should create cancel and delete buttons', () => {
    component.open(component.deleteModal);
    fixture.detectChanges();
    let cancelButton = document.body.querySelector('.modal-dialog .modal-footer .btn-secondary') as HTMLElement;
    let deleteButton = document.body.querySelector('.modal-dialog .modal-footer .btn-danger') as HTMLElement;
    expect(cancelButton).toBeTruthy();
    expect(deleteButton).toBeTruthy();
    expect(cancelButton?.textContent?.trim()).toBe("Cancel");
    expect(deleteButton?.textContent?.trim()).toBe("Delete");
  });

  it('should close modal on cancel click', fakeAsync(() => {
    component.open(component.deleteModal);
    tick(10);
    fixture.detectChanges();
    let cancelButton = document.body.querySelector('.modal-dialog .modal-footer .btn-secondary') as HTMLElement;
    cancelButton.click();
    tick(10);
    fixture.detectChanges();
    expect(component.closeResult).toBe("No delete");
  }));

  it('should close modal and emit data on delete click', fakeAsync(() => {
    spyOn(component.deleteSong, 'emit');
    component.open(component.deleteModal);
    tick(10);
    fixture.detectChanges();
    let deleteButton = document.body.querySelector('.modal-dialog .modal-footer .btn-danger') as HTMLElement;
    deleteButton.click();
    tick(10);
    fixture.detectChanges();
    expect(component.closeResult).toBe("Yes click");
    expect(component.deleteSong.emit).toHaveBeenCalled();
  }));
});
