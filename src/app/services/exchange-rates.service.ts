import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { map, Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { CurrencyDTO } from '../types/currency-dto.model';

@Injectable({
  providedIn: 'root'
})
export class ExchangeRatesService {
  private readonly api = inject(ApiService);

  public getConvertedCurrency(base: string, currency: string): Observable<number> {
    const params = new HttpParams()
      .set('base_currency', base)
      .set('currencies', currency);

    return this.api.get<CurrencyDTO>('', params).pipe(
      map(currencyData => currencyData.data[currency].value)
    );
  }
}
