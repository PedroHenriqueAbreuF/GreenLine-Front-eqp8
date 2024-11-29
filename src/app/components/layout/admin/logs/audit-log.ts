// audit-log.ts

export interface AuditLog {
    id: number;
    operation: string;
    createDate: string | null; // Permite que createDate seja null
    createdBy: number;
  }
  
  export interface AuditLogPage {
    content: AuditLog[];
    // ... outras propriedades de paginação, se necessário
  }