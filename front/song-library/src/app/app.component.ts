import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Song } from './song';
import { Alert } from './alert';
import { SongService } from './song.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm }   from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Options } from '@angular-slider/ngx-slider';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs/Subject';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'SONG LIBRARY';

  // allSongs will keep track of the master list
  public allSongs: Song[] = [];
  // filteredSongs will always be a subset of allSongs
  public filteredSongs: Song[] = [];

  // bind an observable for use with the alert component
  addAlert: Subject<Alert> = new Subject();

  /*
    ngx-slider options
  */
  public minVal: number = 1900;
  public maxVal: number = 2100;
  sliderOptions: Options = {
    floor: this.minVal,
    ceil: this.maxVal,
    showTicks: true
  };

  /*
    mat-table options
  */
  // configure mat-table column bindings
  public songAttributes: string[] = ['title', 'artist', 'release_date', 'price', 'actions'];
  // prepare the data source for mat-table
  public dataSource =  new MatTableDataSource<Song>();
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

          // bind song date range to the slider and reset filter
          const newOptions: Options = Object.assign({}, this.sliderOptions);
          newOptions.floor = Math.min(...this.filteredSongs.map(song => +song.release_date.slice(0,4)));
          newOptions.ceil = Math.max(...this.filteredSongs.map(song => +song.release_date.slice(0,4)));

          if(this.filteredSongs.length <= 2) {
            newOptions.disabled = true;
            newOptions.hideLimitLabels = true;
            newOptions.hidePointerLabels = true;
          } else {
            newOptions.disabled = false;
            newOptions.hideLimitLabels = false;
            newOptions.hidePointerLabels = false;
          }

          this.sliderOptions = newOptions;
          this.minVal = newOptions.floor;
          this.maxVal = newOptions.ceil;


        },
        (err: HttpErrorResponse) => {
          console.warn(err.message);
          this.addAlert.next({
            type: 'danger',
            message: err.message,
          });
        }
      );
  }

  // pass a new song for the song service to add
  public addSong(song: Song): void {
    this.songService.addSong(song).subscribe(
      res => {
        console.log(res);
        this.addAlert.next({
          type: 'success',
          message: res.message,
        });
        this.getSongs();
      },
      (err: HttpErrorResponse) => {
        console.warn(err.message);
        this.addAlert.next({
          type: 'danger',
          message: err.message,
        });
      }
    );
  }

  // pass a song for the song service to update
  public updateSong(song: Song): void {
    console.log(song);
    this.songService.updateSong(song).subscribe(
      res => {
        console.log(res);
        this.addAlert.next({
          type: 'success',
          message: res.message,
        });
        this.getSongs();
      },
      (err: HttpErrorResponse) => {
        console.warn(err.message);
        this.addAlert.next({
          type: 'danger',
          message: err.message,
        });
      }
    );
  }

  // pass an id of a song for the song service to delete
  public deleteSong(id: number): void {
    this.songService.deleteSong(id).subscribe(
      res => {
        console.log(res);
        this.addAlert.next({
          type: 'success',
          message: res.message,
        });
        this.getSongs();
      },
      (err: HttpErrorResponse) => {
        console.warn(err.message);
        this.addAlert.next({
          type: 'danger',
          message: err.message,
        });
      }
    );
  }

  // save a list of all the songs
  public saveList(): void {

    // show a warning if there are no songs filtered
    if(this.filteredSongs.length === 0) {
      this.addAlert.next({
        type: 'warning',
        message: 'You do not have any songs to save!',
      });
      return;
    }

    this.songService.saveList(JSON.stringify(this.filteredSongs)).subscribe(
      (res) => {
        this.addAlert.next({
          type: 'success',
          message: res.message,
        });
        console.log(res)
      },
      (err: HttpErrorResponse) => {
        console.warn(err.error);
        this.addAlert.next({
          type: 'danger',
          message: err.error,
        });
      }
    );
  }

  // limit the rate of fire for filter updates
  public doFilter = this.throttle(() => this.filter());

  // filter the song table based on the release year
  public filter(): void {
    this.filteredSongs = this.allSongs.filter((song) => {
      let year = +song.release_date.slice(0,4);
      return (year >= this.minVal && year <= this.maxVal) ? true : false;
    });
    this.dataSource.data = this.filteredSongs;
  }

  // throttle a function so it fires at most 5 times a second
  private throttle(func: any) {
    var lastTime = 0;
    return function () {
        var now = new Date().getTime();
        if (now - lastTime >= 200) {
            func();
            lastTime = now;
        }
    };
  }

}
