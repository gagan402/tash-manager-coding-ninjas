import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
// import { FormsModule } from '@angular/forms'; // Import FormsModule
// import { CommonModule } from '@angular/common'; // Import CommonModule

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    // FormsModule, // Include FormsModule here
    // CommonModule // Include CommonModule here if not already included
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
