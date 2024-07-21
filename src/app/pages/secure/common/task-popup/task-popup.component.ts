import { SharedService } from './../../../../services/shared.service';
import { ApiCallsService } from './../../../../services/api-service/api-calls.service';
import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import moment from 'moment';

@Component({
  selector: 'app-task-popup',
  standalone: true,
  imports: [MatIconModule, CommonModule, MatSelectModule, MatInputModule, FormsModule, MatFormFieldModule, MatButtonModule,],
  templateUrl: './task-popup.component.html',
  styleUrl: './task-popup.component.css'
})
export class TaskPopupComponent {
  title: string;
  description: string;
  taskData: any;
  constructor(
    private dialogRef: MatDialogRef<TaskPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: ApiCallsService,
    private sharedService: SharedService,
  ) {
    console.log("the data is", data);
    if (data.type !== 'add') {
      this.taskData = data.selectedItem;
      this.title = this.taskData.title;
      this.description = this.taskData.description;
    }
  }

  closePopup() {
    this.dialogRef.close();
  }

  addTask() {
    let obj = {
      status: 'todo',
      userId: this.sharedService.userInfo.id,
      title: this.title,
      description: this.description
    }
    this.apiService.createTask(obj).subscribe({
      next: (res) => {
        console.log("the response is", res);
        (obj as any)['_id'] = res.refId;
        (obj as any)['createdDate'] = moment().format("DD/MM/YYYY hh:mm:s");
        this.dialogRef.close(obj);
      },
      error: (err) => {
        console.error("there is an error while creating a task", err);
        this.dialogRef.close(false);
      }
    })
  }

  modifyTask() {
    let obj = {
      title: this.title,
      taskId: this.taskData._id,
      type: this.data.type === 'edit' ? 'update' : 'delete',
      description: this.description,
      status: this.taskData.status
    }
    this.apiService.modifyTask(obj).subscribe({
      next: (res) => {
        this.dialogRef.close(obj)
        console.log("the response is", res)
      }, error: (err) => {
        console.error("there is an error while creating a task", err);
        this.dialogRef.close(false);
      }
    })
  }
}
