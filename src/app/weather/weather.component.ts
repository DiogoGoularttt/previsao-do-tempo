import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
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
  constructor(private http: HttpClient) {}

  searchWeather() {
    const apiKey = '45f8d6a48ac2279c8954243037bb47b8';
    const geocodingUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${this.cityName}&appid=${apiKey}`;

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
