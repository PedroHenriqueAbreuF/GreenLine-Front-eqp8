import { Component, OnInit } from '@angular/core';
import { AuditLogService } from '../logs/log.service'; 
import { AuditLog, AuditLogPage } from '../logs/audit-log'; 
import { DatePipe, CommonModule  } from '@angular/common';

@Component({
  selector: 'audit-logs',
  standalone: true, 
  templateUrl: './logs.component.html',
  styleUrl: './logs.component.scss',
  imports: [CommonModule],
  providers: [DatePipe]
})
export class LogsComponent implements OnInit {
  auditLogs: AuditLog[] = [];
  // ... outras propriedades para filtros e paginação (se necessário)

  constructor(private auditLogService: AuditLogService, private datePipe: DatePipe) { }

  ngOnInit() {
    this.loadAuditLogs(); 
  }

  loadAuditLogs() {
    this.auditLogService.getAuditLogs(
      // ... passe os parâmetros de filtro e paginação aqui, se necessário
    ).subscribe({
      next: (data: AuditLogPage) => {
        // Formata a data createDate antes de atribuir a auditLogs
        this.auditLogs = data.content.map(log => ({
          ...log,
          createDate: log.createDate ? this.datePipe.transform(log.createDate, 'dd/MM/yyyy HH:mm:ss') : 'Data não disponível' 
        }));

        // ... atualize outras propriedades de paginação, se necessário
      },
      error: (error) => {
        console.error('Erro ao carregar logs de auditoria:', error);
        // Lide com o erro de forma adequada, exibindo uma mensagem para o usuário
      }
    });
  }
}