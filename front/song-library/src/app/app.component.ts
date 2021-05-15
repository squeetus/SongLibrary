import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Song } from './song';
import { SongService } from './song.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm }   from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'song-library';

  // allSongs will keep track of the master list
  public allSongs: Song[] = [];
  // filteredSongs will always be a subset of allSongs
  public filteredSongs: Song[] = [];

  // configure mat-table column bindings
  public songAttributes: string[] = ['title', 'artist', 'release_date', 'price', 'actions'];

  // prepare the data source for mat-table
  public dataSource =  new MatTableDataSource<Song>()

  // declare sorting functionality for the table rows
  @ViewChild(MatSort) sort: any;

  // inject a song service into the module
  constructor(private songService: SongService) {}

  // get all songs on initialization of this module
  ngOnInit() {
    this.getSongs();
  }

  // load all songs from the song service
  public getSongs(): void {
      this.songService.getSongs().subscribe(
        (res: Song[]) => {
          this.allSongs = res;
          this.filteredSongs = this.allSongs;

          // bind song data and sorting to the mat-table dataSource
          this.dataSource.data = this.filteredSongs;
          this.dataSource.sort = this.sort;
        },
        (err: HttpErrorResponse) => {
          console.warn(err.message);
        }
      );
  }

  // pass a new song for the song service to add
  public addSong(song: Song): void {
    this.songService.addSong(song).subscribe(
      res => console.log(res),
      (err: HttpErrorResponse) => {
        console.warn(err.message);
      }
    );
  }

  // pass a song for the song service to update
  public updateSong(song: Song): void {
    this.songService.updateSong(song).subscribe(
      res => console.log(res),
      (err: HttpErrorResponse) => {
        console.warn(err.message);
      }
    );
  }

  // pass an id of a song for the song service to delete
  public deleteSong(id: number): void {
    this.songService.deleteSong(id).subscribe(
      res => {
        console.log(res);
        this.getSongs();
      },
      (err: HttpErrorResponse) => {
        console.warn(err.message);
      }
    );
  }

  // pass a stringified song list to save
  public saveList(songs: Song[]): void {
    this.songService.saveList(JSON.stringify(songs)).subscribe(
      res => console.log(res),
      (err: HttpErrorResponse) => {
        console.warn(err.message);
      }
    );
  }

  // placedholders for filtering the song list
  public filter(): void {
    this.dataSource.data = this.filteredSongs.slice(0,1);
  }
  public unfilter(): void {
    this.dataSource.data = this.allSongs;
  }
}
