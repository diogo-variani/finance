import { Component, Inject, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatTable} from '@angular/material';
import { Category } from 'src/app/models/category';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormBuilder, Validators, FormGroup, FormArray, AbstractControl } from '@angular/forms';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { CategoryTreeService } from 'src/app/services/category-tree.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-category-dialog',
  templateUrl: './category-dialog.component.html',
  styleUrls: ['./category-dialog.component.scss']
})
export class CategoryDialogComponent implements OnInit, OnDestroy {
  
  validationMessages = {
    'title': [
      { type: 'required', message: 'Title is required' }
    ]
  };

  /* Represents the category form group */
  categoryFormGroup: FormGroup;

  /* Array of parents used by the select component */
  parents: Category[];

  filteredOptions: Observable<Category[]>;

  /* Reference to sub category data table */
  @ViewChild('subCategoriesTable', {static: false})
  _subCategoriesTable : MatTable<any>;

  /* It enables/disables the sub category tab */
  subCategoriesEnabled : boolean = false;

  constructor(public dialogRef: MatDialogRef<CategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Category,
    private _categoryTreeService: CategoryTreeService,
    private _formBuilder: FormBuilder,
    private _notificationService: NotificationService) {
            
      
  }

  ngOnInit() {

    /* Creating the form group and populate it with the specified input data */
    this.categoryFormGroup = this._formBuilder.group(
      {
        title: [this.data ? this.data.title : '', Validators.required],
        description: [this.data ? this.data.description : ''],
        parent: '',
        subCategories: this._formBuilder.array(this.data ? this._toFormGroupArray( this.data.subCategories ) : [] )
      }
    );

    /* Load parents */
    this._subscribeParent();


    this._subscribeSubCategories();

    /* 
     * If the input category has a parent, then the 
     * subcategories tab must be disabled
     */
    if( this.data && this.data.parentId ){
      this.subCategoriesEnabled = true;
    }

    /* 
     * Listen the parent changes, it will enable or disable the subcategories
     * based on the parent value.
     * If there is a selected value, the sub categories tab will be disabled,
     * otherwise it will be enabled.
     */

    this.categoryFormGroup.controls.parent.valueChanges
      .pipe( untilDestroyed( this ) )
      .subscribe( value => this.subCategoriesEnabled = !!value );        
  }

  ngOnDestroy(): void {    
  }

  private _subscribeParent(){

    this._categoryTreeService.getRoots().pipe(
      untilDestroyed(this)
    ).subscribe(data => {
      this.parents = data;

      if( this.parents ){
        
        // Load the category parent based on the category list.
        const parent : Category = this.data ? this._getParent( this.data.parentId ) : null;
        this.categoryFormGroup.controls.parent.setValue( parent );

        //  Configure the parent auto complete filter
        this.filteredOptions = this.categoryFormGroup.controls.parent.valueChanges
        .pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value.title),
          map(title => title ? this._filter(title) : this.parents.slice())        
        );   
      }
    });
  }

  private _subscribeSubCategories(){
    //Subscrive for changes from subCategories FormArray
    this.subCategories.valueChanges
    .pipe(
      untilDestroyed(this)
    )
    .subscribe( c =>
      this._subCategoriesTable.renderRows()
    );
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
      title: this._title.value,
      description: this._description.value,
      parentId: this._parent.value ? this._parent.value.id : null,
      subCategories : this._parent.value ? [] : this._toSubCategories()
    }

    this._categoryTreeService.saveEntity(category)
    .pipe(untilDestroyed(this))
    .subscribe(newCategory => {
      this.dialogRef.close(category);
      this._notificationService.showSuccess(`Category ${category.title} has been ${this.data.id ? 'edited' : 'created'} successfully!`);
    });
  }

  addSubCategory(){
    (<FormArray>this.categoryFormGroup.controls['subCategories']).push( 
      this._formBuilder.group({
        id: [null],
        title: ['', Validators.required],
        description: [null]
      })
     );
  }

  removeSubCategory( index: number ){
    this.subCategories.removeAt( index );
  }

  private _filter(title: string): Category[] {
    const filterValue = title.toLowerCase();

    return this.parents.filter(category => category.title.toLowerCase().indexOf(filterValue) === 0);
  }

  private get _parent() : AbstractControl {
    return this.categoryFormGroup.controls.parent as AbstractControl;
  }

  private get _description() : AbstractControl {
    return this.categoryFormGroup.controls.description as AbstractControl;
  }

  private get _title() : AbstractControl {
    return this.categoryFormGroup.controls.title as AbstractControl;
  } 

  get subCategories(): FormArray {
    return this.categoryFormGroup.get('subCategories') as FormArray;    
  }

  private _toSubCategories() : Category[] {    
    return this.subCategories.controls.map( this._toSubCategory );
  }

  private _toSubCategory( control : AbstractControl ) : Category {
    return {
      id: control.get('id').value,
      title: control.get('title').value,
      description: control.get('description').value
    } as Category;
  }

  private _toFormGroupArray( subCategories : Category[] ) : FormGroup[] {

    if(!subCategories ){
      return [];
    }

    return subCategories.map( 
      category => this._formBuilder.group({
        id: [category ? category.id : null],
        title: [category ? category.title : '', Validators.required],
        description: [category ? category.description : null]
      })
    );
  }  
}