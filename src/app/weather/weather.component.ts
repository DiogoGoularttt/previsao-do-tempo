import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { isPlatformBrowser } from '@angular/common';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [FormsModule, CommonModule, FaIconComponent],
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css'],
})
export class WeatherComponent {
  cityName: string = '';
  weatherData: any;
  faMagnifyingGlass = faMagnifyingGlass;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}
  ngOnInit() {
    this.getUserLocation();
  }

  getUserLocation() {
    if (isPlatformBrowser(this.platformId)) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            this.getWeatherByCoords(lat, lon);
          },
          (error) => {
            console.error('Erro ao obter localização:', error);
            if (isPlatformBrowser(this.platformId)) {
              alert(
                'Não foi possível obter sua localização. Por favor, habilite a permissão de localização.'
              );
            }
          }
        );
      } else {
        if (isPlatformBrowser(this.platformId)) {
          alert('Geolocalização não é suportada pelo seu navegador.');
        }
      }
    }
  }

  getWeatherByCoords(lat: number, lon: number) {
    const apiKey = environment.openWeatherMapApiKey;
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=pt`;

    this.http.get(weatherUrl).subscribe((weatherResponse: any) => {
      this.weatherData = weatherResponse;
    });
  }

  searchWeather() {
    const apiKey = '45f8d6a48ac2279c8954243037bb47b8';
    const geocodingUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${this.cityName}&appid=${apiKey}`;

    this.http.get(geocodingUrl).subscribe((geocodingResponse: any) => {
      if (geocodingResponse.length > 0) {
        const lat = geocodingResponse[0].lat;
        const lon = geocodingResponse[0].lon;

        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
        this.http.get(weatherUrl).subscribe((weatherResponse: any) => {
          this.weatherData = weatherResponse;
        });
      } else {
        alert('Cidade não encontrada.');
      }
    });
  }
}
