import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FlowchartTestComponent } from './flowchart-test/flowchart-test.component';
import { FlowchartComponent } from './flowchart/flowchart.component';

const routes: Routes = [
  {path:'',redirectTo:'flowchart',pathMatch:'full'},
  {path:'test',component:FlowchartTestComponent},
  {path:'flowchart',component:FlowchartComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
