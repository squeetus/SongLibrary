import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import {HttpClientModule} from '@angular/common/http';
import { AppComponent } from './app.component';
import { Song } from './song';
import { Response } from './response';
import { Observable, of } from 'rxjs';
import { SongService } from './song.service';
import { By } from "@angular/platform-browser";
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      imports: [
        HttpClientModule,
        MatTableModule
      ],
      providers: [
        {provide: SongService, useClass: SongServiceStub}
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
  });

  it('should create the app', () => {
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it(`should have as title 'SONG LIBRARY'`, () => {
    const component = fixture.componentInstance;
    expect(component.title).toEqual('SONG LIBRARY');
  });

  it('should render title', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.headerBar h1').textContent.trim()).toEqual('SONG LIBRARY');
  });

  it('should call SongService function `getSongs` to populate Song data', () => {
    const component = fixture.componentInstance;
    expect(component.allSongs.length).toBeGreaterThan(0);
  });

  it('should create a Save List button', () => {
    const compiled = fixture.nativeElement;
    const saveButton = compiled.querySelector('.container-fluid .btn-secondary');
    expect(saveButton.textContent).toEqual('Save List');
  });

  it('should save the current Song data when Save List is pressed', fakeAsync(() => {
    spyOn(fixture.componentInstance, 'saveList');
    let saveButton = fixture.debugElement.query(By.css('.container-fluid .btn-secondary'));
    saveButton.triggerEventHandler('click', null);
    tick();
    fixture.detectChanges();
    expect(fixture.componentInstance.saveList).toHaveBeenCalled();
  }));

  it('should create a mat-table', () => {
    const compiled = fixture.nativeElement;
    const tableElement = compiled.querySelector('.container-fluid table');
    expect(tableElement).toBeTruthy();
  });

  it('should populate mat-table with Song data', (finished) => {
    const component = fixture.componentInstance;

    let tableRows = fixture.nativeElement.querySelectorAll('tr');
    expect(tableRows.length).toBe(4);

    let headerRow = tableRows[0];
    expect(headerRow.cells[0].innerHTML).toBe('Title');
    expect(headerRow.cells[1].innerHTML).toBe('Artist');
    expect(headerRow.cells[2].innerHTML).toBe('Release Date');
    expect(headerRow.cells[3].innerHTML).toBe('Price');
    expect(headerRow.cells[4].innerHTML).toBe('Actions');

    let row1 = tableRows[1];
    expect(row1.cells[0].innerHTML.trim()).toBe('Song Title');
    expect(row1.cells[1].innerHTML.trim()).toBe('An Artist');
    expect(row1.cells[2].innerHTML.trim()).toBe('01/01/2019');
    expect(row1.cells[3].innerHTML.trim()).toBe('$14.99');

    finished();
  });

});

class SongServiceStub {
  getSongs(): Observable<Song[]> {
    return of([{
        id: 2,
        title: "Song Title",
        artist: "An Artist",
        release_date: "01-01-2019",
        price: 14.99
    },
    {
        id: 4,
        title: "Another Song",
        artist: "Another Artist",
        release_date: "12-31-2016",
        price: 27.99
    },
    {
        id: 5,
        title: "A Third Song",
        artist: "Artist #3",
        release_date: "07-04-2021",
        price: 17.76
    }]);
  }
}



// return this.http.get<Song[]>(`${this.apiServerUrl}/getAllSongs`);
// }
//
// // post a new song to the back end
// public addSong(song: Song): Observable<Response> {
// return this.http.post<Response>(`${this.apiServerUrl}/song`, song);
// }
//
// // put updates for a song to the back end
// public updateSong(song: Song): Observable<Response> {
// return this.http.put<Response>(`${this.apiServerUrl}/song`, song);
// }
//
// // delete a song based on its id
// public deleteSong(id: number): Observable<Response> {
// return this.http.delete<Response>(`${this.apiServerUrl}/song/${id}`);
// }
//
// // save a list of songs
// public saveList(songs: string): Observable<Response> {
