import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

interface AuditLog {
  id: number;
  operation: string;
  createDate: string; // Certifique-se de que o formato da data seja compatível
  createdBy: number;
}

interface AuditLogPage {
  content: AuditLog[];
  // ... outras propriedades de paginação
}

@Injectable({
  providedIn: 'root'
})
export class AuditLogService {

  API = environment.SERVIDOR+"/api/produto";

  constructor(private http: HttpClient) { }

  getAuditLogs(
    operation?: string,
    createdBy?: number,
    startDate?: string,
    endDate?: string,
    page: number = 0,
    size: number = 10
  ): Observable<AuditLogPage> {
    // Declare o tipo de params explicitamente
    let params: { [key: string]: string | number } = { 
      page, 
      size 
    };
  
    if (operation) params['operation'] = operation;
    if (createdBy) params['createdBy'] = createdBy;
    if (startDate) params['startDate'] = startDate;
    if (endDate) params['endDate'] = endDate;
  
    return this.http.get<AuditLogPage>(this.API+"/api/audit-logs", { params });
  }}