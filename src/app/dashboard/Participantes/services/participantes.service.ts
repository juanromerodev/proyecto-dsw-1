import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Participantes } from '../model/participantes';
 // Asegúrate de importar la interfaz Participante

@Injectable({
  providedIn: 'root'
})
export class ParticipantesService {

  private apiUrl = 'https://localhost:7025/api/Participante'; 

  constructor(private http: HttpClient) { }

  listarParticipantes(): Observable<Participantes[]> {
    return this.http.get<Participantes[]>(`${this.apiUrl}`);
  }

  buscarParticipante(id: number): Observable<Participantes> {
    return this.http.get<Participantes>(`${this.apiUrl}/${id}`);
  }

  agregarParticipante(participante: Participantes): Observable<Participantes> {
    return this.http.post<Participantes>(`${this.apiUrl}/agregar`, participante);
  }

  modificarParticipante(id: number, participante: Participantes): Observable<Participantes> {
    return this.http.put<Participantes>(`${this.apiUrl}/modificar/${id}`, participante);
  }

  eliminarParticipante(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/eliminar?id=${id}`);
  }
}
