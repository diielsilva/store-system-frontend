import { Injectable } from "@angular/core";
import { MessageService } from "primeng/api";

@Injectable({
    providedIn: 'root'
})
export class MessageProvider {
    private message: boolean = false;

    constructor(private messageService: MessageService) { }

    public getMessage(): boolean {
        return this.message;
    }

    public displayMessage(severity: string, summary: string, detail: string): void {
        this.message = true;
        this.messageService.add({ severity, summary, detail })
    }

    public hideMessage(): void {
        this.message = false;
        this.messageService.clear();
    }
}