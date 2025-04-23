import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

interface Quote {
  text: string;
  author: string;
}

@Injectable({
  providedIn: 'root'
})
export class QuotesService {
  // Free API for health and wellness quotes
  private apiUrl = 'https://type.fit/api/quotes';

  constructor(private http: HttpClient) { }

  // Get random wellness quote
  getRandomQuote(): Observable<Quote[]> {
    // This API returns an array of quotes, we'll pick one randomly in the component
    return this.http.get<Quote[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Error fetching quotes:', error);
        // Return a fallback quote if the API fails
        return of([{
          text: 'The greatest wealth is health.',
          author: 'Virgil'
        }]);
      })
    );
  }
}