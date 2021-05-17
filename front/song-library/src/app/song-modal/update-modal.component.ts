import { Input, Output, EventEmitter, Component } from '@angular/core';
import { Song } from '../song';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'update-modal',
  templateUrl: './update-modal.component.html'
})
export class UpdateModalComponent {
  public songForm: FormGroup;
  @Input() song!: Song;
  @Output() updateSong = new EventEmitter<Song>();

  constructor(private modalService: NgbModal, public fb: FormBuilder) {
    this.songForm = this.fb.group({
      title: '',
      id: '',
      artist: '',
      release_date: '',
      price: ''
    });
  }

  public open(editModal: any) {

    this.songForm.patchValue(this.song);

    this.modalService.open(editModal).result.then((result) => {
      // on confirmation, pass the song id to update
      this.updateSong.emit(this.songForm.value);
    }, (reason) => {
      // edit modal dismissed
    });
  }
}
