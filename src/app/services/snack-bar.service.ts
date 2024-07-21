import { Injectable } from "@angular/core";
import {
    MatSnackBar, MatSnackBarHorizontalPosition,
    MatSnackBarVerticalPosition,
} from "@angular/material/snack-bar";

@Injectable({
    providedIn: "root"
})

export class SnackBarService {
    constructor(private snackBar: MatSnackBar) {
    }

    showMessage(message: string, action = "close", config?: any) {
        if (!config) {
            config = {
                horizontalPosition: "right",
                verticalPosition: "top",
                duration: 5000
            }
        }
        this.snackBar.open(message, action, config);
    }

}