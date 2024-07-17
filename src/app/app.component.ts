import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ExchangeRateComponent } from './compnonents/exchange-rate/exchange-rate.component';
import { CurrencyConverterComponent } from './compnonents/currency-converter/currency-converter.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ExchangeRateComponent, CurrencyConverterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'currency-converter-app';
}
