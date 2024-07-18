import { Component,OnInit} from '@angular/core';
import * as FullCalendar from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { CommonModule } from '@angular/common'; // Import CommonModule


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule,RouterOutlet,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'task-manager';
  newTask: any = {};
  todoList: any[] = [];
  categories: string[] = ['Personal', 'Work', 'Shopping'];
  selectedCategory: string = 'Choose Category';
  showIncompleteFirst: boolean = false;
  filteredTasks: any[] = [];
  calendar: any;

  ngOnInit() {
    this.initCalendar();
    this.loadTasks();
    this.updateSelectOptions();
    this.filterTasks();
  }

  initCalendar() {
    const calendarEl = document.getElementById('calendar');
    if (calendarEl) {  // Add null check here
      this.calendar = new FullCalendar.Calendar(calendarEl, {
        plugins: [dayGridPlugin],
        initialView: 'dayGridMonth',
        initialDate: new Date().toISOString().slice(0, 10),
        events: this.todoList.map(task => ({
          id: task.id,
          title: task.todo,
          start: task.date
        }))
      });
      this.calendar.render();
    } else {
      console.error('Calendar element not found');
    }
  }

  addTask() {
    const { todo, category, date, time } = this.newTask;
    if (todo && category && date && time) {
      const newTask = {
        id: this.generateUUID(),
        todo: todo,
        category: category,
        date: date,
        time: time,
        done: false
      };
      this.todoList.push(newTask);
      this.saveTasks();
      this.updateSelectOptions();
      this.clearInputs();
      this.filterTasks();
      this.addEvent(newTask);
    } else {
      alert('Please fill in all fields.');
    }
  }

  sortTasks() {
    this.todoList.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    this.saveTasks();
    this.filterTasks();
  }

  filterTasks() {
    if (this.selectedCategory === 'Choose Category') {
      this.filteredTasks = this.showIncompleteFirst ?
        this.todoList.filter(task => !task.done).concat(this.todoList.filter(task => task.done)) :
        this.todoList;
    } else {
      const filteredList = this.todoList.filter(task => task.category === this.selectedCategory);
      this.filteredTasks = this.showIncompleteFirst ?
        filteredList.filter(task => !task.done).concat(filteredList.filter(task => task.done)) :
        filteredList;
    }
  }

  updateSelectOptions() {
    const categoriesSet = new Set(this.todoList.map(task => task.category));
    this.categories = Array.from(categoriesSet);
  }

  saveTasks() {
    localStorage.setItem('todoList', JSON.stringify(this.todoList));
  }

  loadTasks() {
    const storedTasks = localStorage.getItem('todoList');
    this.todoList = storedTasks ? JSON.parse(storedTasks) : [];
  }

  deleteTask(id: string) {
    this.todoList = this.todoList.filter(task => task.id !== id);
    this.saveTasks();
    this.filterTasks();
    this.calendar.getEventById(id).remove();
  }

  markDone(id: string) {
    const task = this.todoList.find(task => task.id === id);
    if (task) {
      task.done = !task.done;
      this.saveTasks();
      this.filterTasks();
    }
  }

  addEvent(task: any) {
    this.calendar.addEvent({
      id: task.id,
      title: task.todo,
      start: task.date
    });
  }

  generateUUID() {
    let d = Date.now();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
      d += performance.now();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }

  clearInputs() {
    this.newTask = {};
  }

  formatDate(date: string) {
    return new Date(date).toLocaleString('en-GB', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  }

  editTask(event: any, type: string, id: string) {
    const newValue =event.target.value ||event.target.innerText.trim();
    const task = this.todoList.find(task => task.id === id);
    if (task) {
      task[type] = newValue;
      this.saveTasks();
      this.calendar.getEventById(id).remove();
      this.addEvent(task);
    }
  }

}
