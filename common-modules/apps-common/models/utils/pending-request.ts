
import {
    HttpRequest
} from '@angular/common/http';
export interface IPendingRequest {
    path: string;
    data: any;
    requestType: 'MISE A JOUR' | 'SUPPRESSION' | 'INSERTION';
    request: HttpRequest<any>;
}
