import { AuditTrail, auditTrail } from '../../models';

export class AuditService {     
    async createLog(dto: any){
        return ( await auditTrail.create({...dto})) as AuditTrail
    }
  
  }
  