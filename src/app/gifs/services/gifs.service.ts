import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';

@Injectable({providedIn: 'root'})
export class GifsService {
  public gifList: Gif[] = [];
  private _tagsHistory: string[] = [];
  private apiKey: string = 'p4siFsDa7bVRtFw9VZjP89SgAMThEfne';
  private serviceUrl: string = 'https://api.giphy.com/v1/gifs';

  constructor(private http: HttpClient) {
    this.getLocalStorage();
    this.loadGifs();
  }

  get tagsHistory(): string[] {
    return [...this._tagsHistory];
  }

  private loadGifs(): void {
    if(!this.checkLocalStorage()) return;
    this.searchTag(this._tagsHistory[0]);
  }

  private organizeHistory(tag: string): void {
    tag = tag.toLowerCase();
    if(this.tagsHistory.includes(tag)) {
      this._tagsHistory = this._tagsHistory.filter(oldTag => oldTag !== tag);
    }
    this._tagsHistory.unshift(tag);
    this._tagsHistory = this._tagsHistory.splice(0, 10);
    this.saveLocalStorage();
  }

  private saveLocalStorage(): void {
    localStorage.setItem('history', JSON.stringify(this._tagsHistory));
  }

  private getLocalStorage(): void {
    if(!this.checkLocalStorage()) return;
    this._tagsHistory = JSON.parse(localStorage.getItem('history')!);
  }

  private checkLocalStorage(): boolean {
    return localStorage.length > 0;
  }

  public searchTag(newTag: string): void {
    if(newTag.trim().length === 0) return;
    this.organizeHistory(newTag);
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('limit', '10')
      .set('q', newTag);
    this.http.get<SearchResponse>(`${this.serviceUrl}/search`, { params })
      .subscribe(resp => {
        this.gifList = resp.data;
      });
  }
}
