export interface Ensayo {
  ensayoId: number;
  descripcion: string;
  participanteId: number; // apartir del id obtenemos el nombre para setearlo en nombreParticipante
  fechaEntrega: Date;
  nombreParticipante?: string
}
