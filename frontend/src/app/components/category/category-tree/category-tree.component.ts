//https://github.com/alerubis/angular-draggable-mat-tree
import { Component, OnInit, OnDestroy } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';

import { Category } from 'src/app/models/category';
import { CategoryDialogComponent } from '../category-dialog/category-dialog.component';
import { MatSnackBar } from '@angular/material';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { CategoryTreeService } from 'src/app/services/category-tree.service';
import { FlatTreeNode } from '../../abstract/tree/draggable-tree/draggable-tree.component';
import { SelectableTreeComponent } from '../../abstract/tree/selectable-tree/selectable-tree.component';

/*
 * Category flat tree node to be used in the tree.
 */
export class CategoryFlatNode extends Category implements FlatTreeNode{
  level : number;

  getNodeName(): String {
    return this.title;
  }

  isExpandable(): boolean {
    return this.subCategories && this.subCategories.length > 0;
  } 
}

/*
 * Represents the category tree component.
 */
@Component({
  selector: 'app-category-tree',
  templateUrl: './category-tree.component.html',
  styleUrls: ['./category-tree.component.scss']
})
export class CategoryTreeComponent extends SelectableTreeComponent<Category, CategoryFlatNode> implements OnInit, OnDestroy {
     
  /*
   * Represents the default dialog width.
   */
  private readonly DEFAULT_CATEGORY_DIALOG_WIDTH: string = '500px';

  /*
   * Represents the if the edit button is enabled or not. 
   */
  isEditButtonEnable: boolean = true;

  /*
   * Represents a category flat list created from the tree.
   */
  categories: Category[];
    
  constructor(private _categoryTreeService: CategoryTreeService,    
    public dialog: MatDialog,
    private _snackBar: MatSnackBar) {    
      super();
  }

  ngOnInit(): void {
    super.ngOnInit();
    
    this._loadTree();    
    this._subscribeSelectionChanges();    
  }

  ngOnDestroy(): void {        
  }  

  /*
   * It opens a dialog in order to create a new category.
   */
  newCategory() {
    this._openDialog();
  }

  /*
   * It opens a dialog in order to edit a selected category.
   */
  editCategory() {
    const selectedCategory : Category = this._getSelectedCategory();
    this._openDialog( selectedCategory );
  }

  /*
   * It opens the edition/creation dialog and reload the tree if there is any result.
   *
   * @param - the data that eventually will be edited. Null if it is a new category.
   */
  private _openDialog( data? : Category ) {
    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      width: this.DEFAULT_CATEGORY_DIALOG_WIDTH,
      data: data
    });
    
    dialogRef.afterClosed()
      .pipe(
        untilDestroyed(this)
      )
      .subscribe(result => {        
        if (result) {
          this._loadTree();
        }
      }
    );
  }

  /*
   * It deletes the selected category.
   */
  //https://medium.com/@abshakekumar/snackbar-angular-material-component-with-multiple-actions-88ea3a9d3ddd
  deleteCategory() {
    const category: Category = this._getSelectedCategory();

    this._snackBar.open(`Delete category ${category.title}?`, 'Yes', { duration: 5000 }).onAction()
      .pipe(
        untilDestroyed(this)
      )
      .subscribe(() => {
        this._categoryTreeService.deleteEntity(category);
        this._snackBar.open(`Category ${category.title} has been deleted!`);
        this.selection.clear();
      }
    );
  }

  /*
   * Subscribe to tree selecion event. It happens to enable or disable the 
   * toolbar buutons.
   */
  private _subscribeSelectionChanges(){
    this.selection.changed
      .pipe(
        untilDestroyed(this)
      )
      .subscribe(item => {
        this.isEditButtonEnable = this.selection.selected.length == 0;
      }
    );
  }

  /*
   * It loads the category tree from an external service.
   */
  private _loadTree() {

    /* Loading the tree from the service */
    this._categoryTreeService.getEntities()
      .pipe(
        untilDestroyed(this)
      )
      .subscribe(tree => {
        this.dataSource.data = [];
        this.dataSource.data = tree;        

        /* Converting the tree to a flat list, this will enabled the editing */
        this._toFlatList(tree);
        this.treeControl.expansionModel.clear();        
      }
    );
  }

  /*
   * Converts a category tree to a flat list.
   *
   * @param categoryTree - the category tree that will be converted.
   * @param reset - if the category array must be reset. Otherwise the values will be 
   *                concated in the end of the list. The default value is true.
   */
  private _toFlatList( categoryTree : Category[], reset: boolean = true ){
    
    /* If reset is true, the the array is cleaned */
    if( reset || !this.categories ){
      this.categories = [];
    }

    this.categories = this.categories.concat( categoryTree );
    categoryTree.filter( c => c.subCategories ).forEach( c => this._toFlatList(c.subCategories, false ));    
  }

  /*
   * Retrieves the selected category.
   *
   * @returns the category selected in the screen.
   */
  private _getSelectedCategory(): Category {
    if (this.selection.isEmpty()) {
      return null;
    }

    const id: string = this.selection.selected[0];

    if (!id) {
      return null;
    }

    return this._getCategoryById(id);
  }

  /*
   * Query the category array and returns the category identified by the id.
   *
   * @param id - The category id.
   * 
   * @returns the category if found otherwise it returns null.
   */
  private _getCategoryById(id: string): Category {
    if (!id) {
      return null;
    }


    const categories: Category[] = this.categories.filter(c => c.id === id);

    if (!categories || categories.length == 0) {
      return null;
    }

    return categories.shift();
  }

  /*
   * This methos is called when a node is moved and dragged into the tree.
   * If this node was dragged over other one, then the target is represented by the parameter newRoot.
   * 
   * @param newRoot - The new root node where the node was dragged into. 
   *                  If the node was not dragged over other node, then this parameter is null.
   * @param node - The node that was moved.   * 
   */
  protected nodeMoved(root: CategoryFlatNode, node: CategoryFlatNode) {    
    if( root ){
      node.parentId = root.id;
    }else{
      node.parentId = null;
    }


    this._categoryTreeService.saveEntity(node)
      .pipe( untilDestroyed(this) )
      .subscribe( newCategory => {
          this._loadTree();
      });    
  }
 
  /*
   * Returnes the children of an specific application node.
   *
   * @param node - The application node.
   * 
   * @returns The children of the node specified.
   */  
  getNodeChildren(node: Category): Category[] {
    return node.subCategories;
  }

  /*
   * Creates a flat tree node based on the application entity and an specific level.
   *
   * @param node - The application entity.
   * @param number - the node level.
   * 
   * @returns The new flat tree node created.
   */
  createFlatTreeNode(node: Category, level: number): CategoryFlatNode {
    const flatNode = new CategoryFlatNode();    
    Object.assign(flatNode, node);

    flatNode.level = level;
    return flatNode;
  }

  /*
   * It retrieves the node id, which is used as key by the selection model.
   *
   * @param node - The node related to the id retrieved.
   * @returns the id related to the node.
   */  
  protected getNodeId(node: CategoryFlatNode): string {
    return node.id;
  }
}