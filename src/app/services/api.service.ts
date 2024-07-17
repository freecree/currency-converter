import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_URL } from '../tokens/api-url.token';
import { Observable } from 'rxjs';
import { API_KEY } from '../tokens/api_key.token';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly apiKey = inject(API_KEY);
  private readonly apiUrl = inject(API_URL);

  public get<T>(url: string, params: HttpParams = new HttpParams()): Observable<T> {
    const paramsWithApiKey = params.set('apikey', this.apiKey);

    return this.http.get<T>(`${this.apiUrl}${url}`, {
      headers: this.headers,
      params: paramsWithApiKey,
    });
  }

  private get headers(): HttpHeaders {
    const headersConfig = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    return new HttpHeaders(headersConfig);
  }
}
