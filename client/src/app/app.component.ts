import {Component} from '@angular/core'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  items = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  shuffle() {
    this.items = [9, 7, 3, 4, 5, 6, 2, 8, 1];
  }

}
