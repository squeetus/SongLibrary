import { Input, Output, EventEmitter, Component } from '@angular/core';
import { Song } from '../song';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { CustomValidators } from './custom-validators';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'update-modal',
  templateUrl: './update-modal.component.html'
})
export class UpdateModalComponent {
  public songForm: FormGroup;
  @Input() song!: Song;
  @Output() updateSong = new EventEmitter<Song>();

  faEdit = faEdit;

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

  // handle the update modal
  public open(editModal: any) {

    // bind the current song to the form
    this.songForm.patchValue(this.song);

    // open the modal and handle the result
    this.modalService.open(editModal).result.then((result) => {
      console.log(this.songForm);

      // make sure the Song form is valid
      if(this.songForm.valid) {
        // pass the song values to the parent module to update
        this.updateSong.emit(this.songForm.value);
      }
    }, (reason) => {
      // edit modal dismissed
    });
  }
}
