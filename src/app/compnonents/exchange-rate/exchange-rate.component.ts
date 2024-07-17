import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ExchangeRatesService } from '../../services/exchange-rates.service';
import { AsyncPipe, CurrencyPipe, JsonPipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-exchange-rate',
  standalone: true,
  imports: [AsyncPipe, JsonPipe, MatToolbarModule, CurrencyPipe],
  templateUrl: './exchange-rate.component.html',
  styleUrl: './exchange-rate.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExchangeRateComponent {
  private readonly exchangeRateService = inject(ExchangeRatesService);

  public readonly usd$ = this.exchangeRateService.getConvertedCurrency('USD', 'UAH');
  public readonly eur$ = this.exchangeRateService.getConvertedCurrency('EUR', 'UAH');
}
