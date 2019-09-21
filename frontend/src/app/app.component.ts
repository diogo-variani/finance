import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'personal-finance';

  constructor(private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer){
    
    this.matIconRegistry.addSvgIcon(
      'delete-tree',
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/delete-tree.svg")
    );

    this.matIconRegistry.addSvgIcon(
      'delete-node',
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/delete-node.svg")
    );    
  }  
}
