import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, mergeMap, switchMap } from 'rxjs';
import { Ensayo } from '../model/ensayos';

@Injectable({
  providedIn: 'root'
})
export class EnsayosService {

  private apiUrl = 'https://localhost:7025/api/Ensayo';
  private participanteUrl = 'https://localhost:7025/api/Participante';

  constructor(private http: HttpClient) { }

  listarEnsayos(): Observable<Ensayo[]> {
    return this.http.get<Ensayo[]>(`${this.apiUrl}/listar`).pipe(
      switchMap((ensayos: Ensayo[]) => {
        const observables: Observable<Ensayo>[] = ensayos.map(ensayo => {
          return this.obtenerNombreParticipante(ensayo.participanteId).pipe(
            map((response: any) => {
              if (typeof response === 'object' && response.nombre) {
                ensayo.nombreParticipante = response.nombre;
              } else {
                ensayo.nombreParticipante = response.nombre;
              }
              return ensayo;
            })
          );
        });
        return forkJoin(observables);
      })
    );
  }

  agregarEnsayo(ensayo: Ensayo): Observable<Ensayo> {
    return this.http.post<Ensayo>(`${this.apiUrl}/agregar`, ensayo);
  }

  buscarEnsayo(id: number): Observable<Ensayo> {
    return this.http.get<Ensayo>(`${this.apiUrl}/buscar/${id}`);
  }

  modificarEnsayo(id: number, ensayo: Ensayo): Observable<Ensayo> {
    return this.http.put<Ensayo>(`${this.apiUrl}/modificar/${id}`, ensayo);
  }

  eliminarEnsayo(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/eliminar?id=${id}`);
  }


  private obtenerNombreParticipante(id: number): Observable<string> {
    return this.http.get<string>(`${this.participanteUrl}/nombre/${id}`);
  }
}
