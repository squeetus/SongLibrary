import { Observable } from 'rxjs';
import { Song } from './song';
import { Response } from './response';
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
/*
  Service for making requests to the backend Song API
*/
export class SongService {
  private apiServerUrl = environment.apiBaseUrl;

  // inject an httpclient into the song service constructor
  constructor(private http: HttpClient) {}

  // get an array of songs
  public getSongs(): Observable<Song[]> {
    return this.http.get<Song[]>(`${this.apiServerUrl}/getAllSongs`);
  }

  // post a new song to the back end
  public addSong(song: Song): Observable<Response> {
    return this.http.post<Response>(`${this.apiServerUrl}/song`, song);
  }

  // put updates for a song to the back end
  public updateSong(song: Song): Observable<Response> {
    return this.http.put<Response>(`${this.apiServerUrl}/song`, song);
  }

  // delete a song based on its id
  public deleteSong(id: number): Observable<Response> {
    return this.http.delete<Response>(`${this.apiServerUrl}/song/${id}`);
  }

  // save a list of songs
  public saveList(songs: string): Observable<Response> {
    return this.http.post<Response>(`${this.apiServerUrl}/saveList`, {"songs": songs});
  }
}
