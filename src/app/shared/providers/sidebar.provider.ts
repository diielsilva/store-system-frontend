import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class SidebarProvider {
    public sidebar: boolean = false;

    public displayOrHideSidebar(): void {
        this.sidebar = !this.sidebar;
    }

}