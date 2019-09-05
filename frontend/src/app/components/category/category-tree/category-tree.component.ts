//https://github.com/alerubis/angular-draggable-mat-tree
import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';

import { FlatTreeControl } from '@angular/cdk/tree';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';

import { CategoryService } from "../../../services/category.service";
import { Category } from 'src/app/models/category';
import { CategoryDialogComponent } from '../category-dialog/category-dialog.component';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material';

/** Flat to-do item node with expandable and level information */
export class CategoryFlatNode extends Category {
  level: number;
  expandable: boolean;
}

@Component({
  selector: 'app-category-tree',
  templateUrl: './category-tree.component.html',
  styleUrls: ['./category-tree.component.scss']
})
export class CategoryTreeComponent implements OnInit {

  private DEFAULT_CATEGORY_DIALOG_WIDTH : string = '500px';

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<string, CategoryFlatNode>();

  treeControl: FlatTreeControl<CategoryFlatNode>;

  treeFlattener: MatTreeFlattener<Category, CategoryFlatNode>;

  dataSource: MatTreeFlatDataSource<Category, CategoryFlatNode>;

  /** The selection for checklist */
  selection = new SelectionModel<string>(false /* multiple */);

  isEditButtonEnable : boolean = true;

  categories : Category[];

  /* Drag and drop */
  dragFlatNode: CategoryFlatNode;
  dragNodeExpandOverWaitTimeMs = 300;
  dragNodeExpandOverNode: CategoryFlatNode;
  dragNodeExpandOverTime: number;
  dragNodeExpandOverArea: string;
  @ViewChild('emptyItem', { static: false }) emptyItem: ElementRef;

  constructor(  private _categoryService: CategoryService, 
                public dialog: MatDialog,
                private _snackBar: MatSnackBar) {

    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel, this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<CategoryFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    this.getCategories();    

    this.selection.changed.subscribe(item=>{
      this.isEditButtonEnable = this.selection.selected.length == 0;
    })
  }

  ngOnInit(): void {
    this.selection.onChange.subscribe(v => console.log(v));
  }

  getCategories(){
    const selectedCategories : string[] = this.selection.selected;

    this._categoryService.getEntities().subscribe(categories => {
      this.categories = categories;
      this.dataSource.data = [];
      this.dataSource.data = this.buildTree(categories);
      
      if( selectedCategories ){        
        selectedCategories.forEach( categoryId => this.selection.toggle( categoryId ) );
      }
    });
  }

  private buildTree( categories : Category[] ) : Category[] {
    //Filtering the root elements
    let root = new Map();
    categories.filter( category => !category.parentId ).forEach( category => {
      root.set( category.id, category );
      category.subCategories = [];
    });

    //Appending child to the root categories
    categories.filter( category => category.parentId != null ).forEach(
      category => {
        let parent : Category = root.get( category.parentId );
        if( !parent ) return;       
        parent.subCategories.push( category );
      }
    );

    return Array.from( root.values() );
  }  

  getLevel = (node: CategoryFlatNode) => node.level;

  isExpandable = (node: CategoryFlatNode) => node.expandable;

  getChildren = (node: Category): Category[] => node.subCategories;

  hasChild = (_: number, _nodeData: CategoryFlatNode) => _nodeData.expandable;

  hasNoContent = (_: number, _nodeData: CategoryFlatNode) => _nodeData.title === '';

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  transformer = (node: Category, level: number) => {
    const flatNode = new CategoryFlatNode();
    Object.assign(flatNode, node);
    flatNode.level = level;
    flatNode.expandable = (node.subCategories && node.subCategories.length > 0);
    this.nestedNodeMap.set(node.id, flatNode);
    return flatNode;
  }
  
  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: CategoryFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.selection.isSelected(child.id));
    return result;
  }

  handleDragStart(event, node) {
    // Required by Firefox (https://stackoverflow.com/questions/19055264/why-doesnt-html5-drag-and-drop-work-in-firefox)
    event.dataTransfer.setData('foo', 'bar');
    event.dataTransfer.setDragImage(this.emptyItem.nativeElement, 0, 0);
    this.dragFlatNode = node;
    this.treeControl.collapse(node);
  }

  handleDragOver(event, node) {
    event.preventDefault();

    // Handle node expand
    if (node === this.dragNodeExpandOverNode) {
      if (this.dragFlatNode !== node && !this.treeControl.isExpanded(node)) {
        if ((new Date().getTime() - this.dragNodeExpandOverTime) > this.dragNodeExpandOverWaitTimeMs) {
          this.treeControl.expand(node);
        }
      }
    } else {
      this.dragNodeExpandOverNode = node;
      this.dragNodeExpandOverTime = new Date().getTime();
    }

    // Handle drag area
    const percentageX = event.offsetX / event.target.clientWidth;
    const percentageY = event.offsetY / event.target.clientHeight;
    if (percentageY < 0.25) {
      this.dragNodeExpandOverArea = 'above';
    } else if (percentageY > 0.75) {
      this.dragNodeExpandOverArea = 'below';
    } else {
      this.dragNodeExpandOverArea = 'center';
    }
  }

  handleDrop(event, flatNode: CategoryFlatNode) {
    event.preventDefault();
    if (flatNode !== this.dragFlatNode) {

      //Get the dragged node's root...
      let root: CategoryFlatNode = this.getRoot(this.dragNodeExpandOverNode);

      //Configure the parent id if there is a root...
      if (!this.isRoot(this.dragNodeExpandOverNode) || this.dragNodeExpandOverArea == 'center') {
        this.dragFlatNode.parentId = root.id;
      } else {
        this.dragFlatNode.parentId = null;
      }

      //Save the category...
      this._categoryService.saveEntity(this.dragFlatNode);

      //Expand the root node...
      if (root) {
        this.treeControl.expand(this.nestedNodeMap.get(root.id));
      }

    }
    this.dragFlatNode = null;
    this.dragNodeExpandOverNode = null;
    this.dragNodeExpandOverTime = 0;
  }

  isRoot(node: CategoryFlatNode): boolean {
    return node.parentId == null;
  }

  private getRoot(child: CategoryFlatNode): CategoryFlatNode {
    if (!child) return null;

    let parent: CategoryFlatNode = this.nestedNodeMap.get(child.id);

    while (parent.parentId) {
      parent = this.nestedNodeMap.get(parent.parentId);
    }

    return parent;
  }

  handleDragEnd(event) {
    this.dragFlatNode = null;
    this.dragNodeExpandOverNode = null;
    this.dragNodeExpandOverTime = 0;
  }

  newCategory() {
    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      width: this.DEFAULT_CATEGORY_DIALOG_WIDTH,
      data: {}
    });

    dialogRef.afterClosed().subscribe( result => {
      if( result ){
        this.getCategories();
      }
    });
  }

  editCategory() {
    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      width: this.DEFAULT_CATEGORY_DIALOG_WIDTH,
      data: this._getSelectedCategory()
    });

    dialogRef.afterClosed().subscribe( result => {      
      if( result ){
        this.getCategories();
      }
    });
  }

  deleteCategory() {
    const category : Category = this._getSelectedCategory();
    
    this._snackBar.open(`Delete category ${category.title}?`, 'Yes', {duration: 5000 }).onAction().subscribe(() => {
      this._categoryService.deleteEntity( category );
      this._snackBar.open(`Category ${category.title} has been deleted!`);
      this.selection.clear();
    });
  }

  private _getSelectedCategory() : Category {
    if( this.selection.isEmpty() ){
      return null;
    }

    const id : string = this.selection.selected[0];

    if( !id ){
      return null;
    }
    
    return this._getCategory( id );
  }

  private _getCategory( id : string ) : Category {
    if( !id ){
      return null;
    }

    const categories : Category[] = this.categories.filter( c => c.id === id );

    if( !categories || categories.length == 0 ){
      return null;
    }

    return categories.shift();
  }
}