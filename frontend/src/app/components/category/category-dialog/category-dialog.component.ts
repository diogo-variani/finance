import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { Category } from 'src/app/models/category';
import { CategoryService } from 'src/app/services/category.service';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-category-dialog',
  templateUrl: './category-dialog.component.html',
  styleUrls: ['./category-dialog.component.scss']
})
export class CategoryDialogComponent implements OnInit {

  validationMessages = {
    'title': [
      { type: 'required', message: 'Title is required' }
    ]
  };

  categoryFormGroup: FormGroup;

  parents: Category[];

  filteredOptions: Observable<Category[]>;

  constructor(public dialogRef: MatDialogRef<CategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Category,
    private _categoryService: CategoryService,
    private _formBuilder: FormBuilder,
    private _snackBar: MatSnackBar) {    
      
      this.categoryFormGroup = this._formBuilder.group(
        {
          title: [this.data ? this.data.title : '', Validators.required],
          description: [this.data ? this.data.description : ''],
          parent: ''
        }
      );       

  }

  ngOnInit() {

    this._categoryService.getEntities().subscribe(data => {
      this.parents = data;

      if( this.parents ){
        const parent : Category = this.data ? this._getParent( this.data.parentId ) : null;
        this.categoryFormGroup.controls.parent.setValue( parent );

        this.filteredOptions = this.categoryFormGroup.controls.parent.valueChanges
        .pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value.title),
          map(title => title ? this._filter(title) : this.parents.slice())
        );        
      }
    });
  }

  private _getParent( id : string ) : Category {
    return id ? this.parents.filter( item => item.id === id ).shift() : null;
  }

  displayTitle(category: Category): string | undefined {
    return category ? category.title : undefined;
  }

  cancel(): void {
    this.dialogRef.close();
  }

  save(): void {
    const category: Category = {
      id: this.data ? this.data.id : null,
      title: this.categoryFormGroup.controls.title.value,
      description: this.categoryFormGroup.controls.description.value,
      parentId: this.categoryFormGroup.controls.parent.value ? this.categoryFormGroup.controls.parent.value.id : ''
    }

    this._categoryService.saveEntity(category);
    this.dialogRef.close(category);
    
    this._snackBar.open(`Category ${category.title} has been ${this.data.id ? 'edited' : 'created'} successfully!`);
  }

  private _filter(title: string): Category[] {
    const filterValue = title.toLowerCase();

    return this.parents.filter(category => category.title.toLowerCase().indexOf(filterValue) === 0);
  }
}