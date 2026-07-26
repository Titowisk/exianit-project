import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tag } from '../models/tag.interface';
import { AuthService } from './auth.service';
import { APP_CONFIG } from '../models/app-config.interface';

@Injectable({
  providedIn: 'root'
})
export class TagService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private config = inject(APP_CONFIG);
  private get apiUrl() { return this.config.apiUrl; }

  getTags(): Observable<Tag[]> {
    const userId = this.authService.userId();
    return this.http.get<Tag[]>(`${this.apiUrl}/tags?userId=${userId}`);
  }

  createTag(name: string, color: string): Observable<Tag> {
    const userId = this.authService.userId();
    return this.http.post<Tag>(`${this.apiUrl}/tags?userId=${userId}`, { name, color });
  }
}
