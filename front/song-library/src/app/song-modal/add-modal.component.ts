import { Input, Output, EventEmitter, Component } from '@angular/core';
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
  @Input() song!: Song;
  @Output() addSong = new EventEmitter<Song>();

  // set the structure and validators for the song form
  constructor(private modalService: NgbModal, public fb: FormBuilder) {
    this.songForm = this.fb.group({
      id: '',
      title: ['', Validators.required],
      artist: ['', Validators.required],
      release_date: ['', [Validators.required, CustomValidators.songDate]],
      price: ['', [Validators.required, Validators.min(0), Validators.max(1000000)]]
    });
  }

  // expose controls for reactive validation
  get songFormControl() {
    return this.songForm.controls;
  }

  // handle the add modal
  public open(addModal: any) {

    // open the modal and handle the result
    this.modalService.open(addModal).result.then((result) => {
      console.log(this.songForm);

      // make sure the Song form is valid
      if(this.songForm.valid) {
        // pass the song values to the parent module to add
        this.addSong.emit(this.songForm.value);
      }
    }, (reason) => {
      // edit modal dismissed
    });
  }
}
