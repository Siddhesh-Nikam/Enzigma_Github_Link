import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import Task from '../../types/task';
import { TaskService } from '../../service/task.service';
import { RouterLink } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-read',
  standalone: true,

  imports: [
    MatTableModule,
    MatPaginator,
    MatPaginatorModule,
    MatSort,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    CommonModule,
    RouterLink,
    MatIconModule,
    MatDividerModule,
    MatButtonModule
  ],

  templateUrl: './read.component.html',
  styleUrl: './read.component.css'
})

export class ReadComponent implements AfterViewInit {

  formBuilder = inject(FormBuilder);

  taskForm: FormGroup = this.formBuilder.group({
    AssignedTo: ['', [Validators.required]],
    Status: ['', [Validators.required]],
    DueDate: ['', [Validators.required]],
    Priority: ['', [Validators.required]],
    Comments: ['', [Validators.required]],
  });

  taskService = inject(TaskService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  editUserId!: string;


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  
  displayedColumns: string[] = ['_id', 'AssignedTo', 'Status','DueDate','Priority','Comments','actions']; 
  dataSource = new MatTableDataSource<any>([]); 

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  tasks:Task[]=[];

  ngOnInit(){
    this.taskService.getTasks().subscribe((result)=>{
      this.tasks=result;
      console.log(this.tasks);
      this.dataSource.data = this.tasks;
    },(error)=>{
      console.error('Error fetching tasks:', error);
    })
  }

  addTask() {
    if (this.taskForm.invalid) {
      alert("Please provide all fields");
      return;
    }
  
    const model: Task = this.taskForm.value;
    this.taskService.addTask(model).subscribe(result => {
      alert("Task added successfully");
      this.router.navigateByUrl("/");
    });
  }

  delete(id:string){
    const ok=confirm("Are you sure want to delete?");
    if(ok){
      this.taskService.deleteTask(id).subscribe((result)=>{
        alert("User deleted sucessfully");
        this.tasks=this.tasks.filter((t)=>t._id!=id);
        this.router.navigateByUrl("/");
      })
    }
  }

  

}
