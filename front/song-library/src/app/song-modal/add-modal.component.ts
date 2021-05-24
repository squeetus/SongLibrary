import { Input, Output, EventEmitter, Component, TemplateRef, ViewChild } from '@angular/core';
import { Song } from '../song';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { CustomValidators } from './custom-validators';

@Component({
  selector: 'add-modal',
  templateUrl: './add-modal.component.html'
})
export class AddModalComponent {
  public songForm: FormGroup;

  closeResult?: string;

  @Input() song!: Song;
  @Output() addSong = new EventEmitter<Song>();
  @ViewChild('addModal') addModal!: TemplateRef<any>;

  // set the structure and validators for the song form
  constructor(private modalService: NgbModal, public fb: FormBuilder) {
    this.songForm = this.fb.group({
      id: '',
      title: ['', [Validators.required, Validators.maxLength(100)]],
      artist: ['', [Validators.required, Validators.maxLength(100)]],
      release_date: ['', [Validators.required, CustomValidators.songDate]],
      price: ['', [Validators.required, Validators.min(0), Validators.max(1000000)]]
    });
  }

  // reset the reactive form
  resetForm(): void {
    this.songForm.reset();
  }

  // expose controls for reactive validation
  get songFormControl() {
    return this.songForm.controls;
  }

  // handle the add modal
  public open(addModal: any) {

    // open the modal and handle the result
    this.modalService.open(addModal).result.then((result) => {
      this.closeResult = result;

      // make sure the Song form is valid
      if(this.songForm.valid) {
        // pass the song values to the parent module to add
        this.addSong.emit(this.songForm.value);

        // reset the form for the next add action
        this.resetForm();
      }
    }, (reason) => {
      // edit modal dismissed
      this.closeResult = reason;

      // reset the form if cancel button pressed
      if(reason == 'No add')
        this.songForm.reset();
    });
  }
}
