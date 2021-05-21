import { TestBed } from '@angular/core/testing';
// import { HttpClient, HttpHandler } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { SongService } from './song.service';
import { Song } from './song';

describe('SongService', () => {
  let service: SongService;
  let httpTestingController: HttpTestingController;
  let baseUrl = "";
  let song: Song;


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
      // providers: [HttpClient, HttpHandler]
    });

    service = TestBed.inject(SongService);

    httpTestingController = TestBed.get(HttpTestingController);
     song = {
       id: 2,
       title: "Song Title",
       artist: "An Artist",
       release_date: "01-01-2019",
       price: 14.99
     };
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it("getSongs should return Song data", () => {
    let result: Song[];
    service.getSongs().subscribe(s => {
      result = s;
      expect(result[0]).toEqual(song);
    });
    const req = httpTestingController.expectOne({
      method: "GET",
      url: "http://localhost:3000/getAllSongs"
    });
    expect(req.request.method).toBe('GET');
    req.flush([song]);
    httpTestingController.verify();
  });

  it("saveList should save Song data", () => {
    service.saveList(JSON.stringify(song)).subscribe();
    const req = httpTestingController.expectOne({
      method: "POST",
      url: "http://localhost:3000/saveList"
    });
    expect(req.request.method).toBe('POST');
    req.flush(JSON.stringify(song));
    httpTestingController.verify();
    expect(req.request.body.songs).toContain(song.title);
  });

  it("should call POST to add a new Song", () => {
    service.addSong(song).subscribe();
    const req = httpTestingController.expectOne({
      method: "POST",
      url: "http://localhost:3000/song"
    });
    expect(req.request.method).toBe('POST');
    req.flush(song);
    httpTestingController.verify();
    expect(req.request.body).toEqual(song);
  });

  it("should call PUT to update a Song", () => {
    service.updateSong(song).subscribe();
    const req = httpTestingController.expectOne({
      method: "PUT",
      url: "http://localhost:3000/song"
    });
    expect(req.request.method).toBe('PUT');
    req.flush(song);
    httpTestingController.verify();
    expect(req.request.body).toEqual(song);
  });

  it("should call DELETE to remove a Song", () => {
    service.deleteSong(song.id).subscribe((data: any) => {
      expect(data).toBe(song.id);
    });
    const req = httpTestingController.expectOne({
      method: "DELETE",
      url: `http://localhost:3000/song/${song.id}`
    });
    expect(req.request.method).toBe('DELETE');
    req.flush(song.id);
    httpTestingController.verify();

  });

});
