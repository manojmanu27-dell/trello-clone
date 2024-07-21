import { ApiCallsService } from './../../../services/api-service/api-calls.service';
import { SharedService } from './../../../services/shared.service';
import { MatButtonModule } from '@angular/material/button';
import { Component, OnInit } from '@angular/core';
import { TaskList } from '../../../model/TaskList';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TaskPopupComponent } from '../common/task-popup/task-popup.component';
import { MatDialog } from '@angular/material/dialog';
import moment from 'moment';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatButtonModule, CommonModule, MatTooltipModule, MatIconModule, MatFormFieldModule, MatInputModule, FormsModule, MatSelectModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  taskList: TaskList[] = [];
  currentTask: TaskList;
  searchTask: string;
  constructor(private dialog: MatDialog, private apiService: ApiCallsService, private sharedService: SharedService) {

  }

  ngOnInit(): void {
    this.taskList = this.sharedService.userTasks;
    if (this.taskList.length > 0) {
      this.taskList.forEach((item) => {
        item.createdDate = moment(item.createdDate, "DD/MM/YYYY hh:mm:s", true).isValid() ? item.createdDate : moment(item.createdDate).format("DD/MM/YYYY hh:mm:s");
      })
    }
  }

  filterTasks(status: string): TaskList[] {
    return this.taskList.filter((obj) => obj.status === status);
  }

  onDrop(event: any, status: string) {
    // event
    console.log("the status ios", status, this.currentTask)
    this.currentTask.status = status;
    let obj = {
      title: this.currentTask.title,
      taskId: this.currentTask._id,
      type: 'update',
      description: this.currentTask.description,
      status: this.currentTask.status
    }
    this.apiService.modifyTask(obj).subscribe({
      next: (res) => {
        console.log("Task has been updated successfully", res)
      },
      error: (err) => {
        console.error("there has been an error",err)
      }
    })
  }

  onDropOver(event: any) {
    event.preventDefault();
    console.log("On drag over is called")
  }

  setDraggedItem(task: TaskList) {
    console.log("the task is", task)
    this.currentTask = task;
  }

  openTaskPopup(type: string, task?: TaskList) {
    this.dialog.open(TaskPopupComponent, { data: { type, selectedItem: task } }).afterClosed().subscribe({
      next: (res) => {
        console.log("the response is", res)
        if (res) {
          switch (type) {
            case 'add':
              this.taskList.push(res);
              break;
            case 'delete':
              this.taskList = this.taskList.filter((item) => item._id !== task?._id);
              break;
            case 'edit':
              let item = this.taskList.filter((item) => item._id === task?._id)[0];
              console.log("the item is", item)
              item.title = res.title;
              item.description = res.description;
              break;
          }
        }
        this.sharedService.userTasks = this.taskList;
      }
    })

  }

}
