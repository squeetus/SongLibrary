import { AfterViewInit, Input, Output, EventEmitter, Component, TemplateRef, ViewChild } from '@angular/core';
import { Song } from '../song';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'delete-modal',
  templateUrl: './delete-modal.component.html'
})
export class DeleteModalComponent {

  faTimes = faTimes;
  closeResult?: string;

  constructor(private modalService: NgbModal) { }

  @Input() song!: Song;
  @Output() deleteSong = new EventEmitter<number>();
  @ViewChild('deleteModal') deleteModal!: TemplateRef<any>;

  public open(deleteModal: any) {
    this.modalService.open(deleteModal).result.then((result) => {
      // on confirmation, pass the song id to delete
      this.closeResult = result;
      this.deleteSong.emit(this.song.id);
    }, (reason) => {
      this.closeResult = reason;
      // delete modal dismissed
    });
  }

}
