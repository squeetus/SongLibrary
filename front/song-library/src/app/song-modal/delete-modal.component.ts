import { Input, Output, EventEmitter, Component } from '@angular/core';
import { Song } from '../song';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'delete-modal',
  templateUrl: './delete-modal.component.html'
})
export class DeleteModalComponent {

  constructor(private modalService: NgbModal) { }

  @Input() song!: Song;
  @Output() deleteSong = new EventEmitter<number>();

  public open(deleteModal: any) {
    this.modalService.open(deleteModal).result.then((result) => {
      // on confirmation, pass the song id to delete
      this.deleteSong.emit(this.song.id);
    }, (reason) => {
      // delete modal dismissed
    });
  }

}
