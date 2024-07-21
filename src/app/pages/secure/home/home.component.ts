import { ApiCallsService } from './../../../services/api-service/api-calls.service';
import { SharedService } from './../../../services/shared.service';
import { MatButtonModule } from '@angular/material/button';
import { Component, OnInit } from '@angular/core';
import { TaskList } from '../../../model/TaskList';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TaskPopupComponent } from '../common/task-popup/task-popup.component';
import { MatDialog } from '@angular/material/dialog';
import moment from 'moment';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatButtonModule, MatRadioModule, MatAutocompleteModule, CommonModule, MatTooltipModule, MatIconModule, MatFormFieldModule, MatInputModule, FormsModule, MatSelectModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  taskList: TaskList[] = [];
  tempList: TaskList[] = [];
  filterTaskList: TaskList[] = [];
  currentTask: TaskList;
  searchTask: string;
  sortBy: string = "recent";
  constructor(private dialog: MatDialog, private router: Router, private apiService: ApiCallsService, private sharedService: SharedService) {
    if (!this.sharedService.isUserLoggedIn) {
      this.router.navigateByUrl("/login")
    }
  }

  ngOnInit(): void {
    this.taskList = Array.isArray(this.sharedService.userTasks) ? this.sharedService.userTasks : [];
    console.log("the task list is", this.taskList)
    if (this.taskList.length > 0) {
      this.taskList.forEach((item) => {
        item.createdDate = moment(item.createdDate, "DD/MM/YYYY hh:mm:ss", true).isValid() ? item.createdDate : moment(item.createdDate).format("DD/MM/YYYY hh:mm:ss");
      })
    }
    this.tempList = this.taskList;

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
        console.error("there has been an error", err)
      }
    })
  }

  searchTasks() {
    console.log("on change of the task nae,", this.searchTask);
    this.filterTaskList = this.taskList.filter((item) => item.title.toLowerCase().includes(this.searchTask.toLowerCase()));
    if (!this.searchTask) {
      this.taskList = this.tempList;
      this.filterTaskList = this.taskList;
    }
    console.log("the task list is", this.filterTaskList)
  }

  sortTask() {
    console.log("the sort type is", this.sortBy)
    switch (this.sortBy) {
      case 'recent':
        this.taskList = this.taskList.sort((a, b) => moment(a.createdDate, "DD/MM/YYYY hh:mm:ss").toDate().getMinutes() - moment(b.createdDate, "DD/MM/YYYY hh:mm:ss").toDate().getMinutes()
        )
        break;
      case 'title':
        this.taskList = this.taskList.sort((a, b) => a.title.toLowerCase() < b.title.toLowerCase() ? -1 : 1)
    }
    // this.taskList = this.taskList.sort
  }

  showTask(title: string) {
    this.taskList = this.tempList.filter((item) => item.title.toLowerCase() === title.toLowerCase())
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
        this.tempList = this.taskList;
      }
    })

  }

}
