import { ElementRef, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';

/** Flat Node used to create the tree */
export interface FlatTreeNode {
  
  /* Represents the node level in the tree */
  level: number;

  /* Returnes the node name */
  getNodeName() : String;

  /* Indicates if the node is expandable */
  isExpandable() : boolean;

}

/*
 * Component that represents an angular material draggable tree.
 * The tree is built using a basic strucuted defined by FlatTreeNode.
 */
export abstract class DraggableTreeComponent<O, T extends FlatTreeNode> implements OnInit {

  /*
   * Represents the Flat Tree Control used by the data table.
   */
  treeControl: FlatTreeControl<T>;
  
  /*
   * Represents the tree flatterned used to create the tree.
   */
  protected treeFlattener: MatTreeFlattener<O, T>;

  /*
   * Represents the table data source.
   */
  protected dataSource: MatTreeFlatDataSource<O, T>;
  
  /*
   * Represents the node that is beeing dragged.
   */
  private dragFlatNode: T;

  /*
   * Represents the node which the dragged node will be dropped.
   */
  private dragNodeExpandOverNode: T;
  
  /*
   * Represents the area where the node is over.
   */
  private dragNodeExpandOverArea: string;
  
  /*
   * Reference to the page element that will represent the shaddow when a node is moved.
   */
  @ViewChild('emptyItem', { static: false }) 
  private emptyItem: ElementRef;
  
  constructor() {    
  }

  /*
   * Function called when the component starts.
   */
  ngOnInit(): void {
    this.treeFlattener = new MatTreeFlattener(this.createFlatTreeNode, this.getLevel, this.isExpandable, this.getNodeChildren);
    this.treeControl = new FlatTreeControl<T>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  }

  /*
   * Retrieves the level of an specific flat tree node.
   *
   * @param node - The flat tree node.
   * 
   * @returns The flat tree node level in the tree.
   */
  private getLevel = (node: T) => node.level;

  /*
   * Indicates if the flat tree node is expandable.
   *
   * @param node - The flat tree node.
   * 
   * @returns a flat that indicates if the flat tree node is exapandable.
   */
  private isExpandable = (node: T) => node.isExpandable();

  /*
   * Indicates if the flat tree node has any child. If it does, it returns true 
   * and false otherwise.
   * 
   * @param _nodeData - The flat tree node that will be verified.
   * 
   * @returns true if the node has any child and false otherwise.
   */
  hasChild = ( _: number, _nodeData: T) : boolean => _nodeData.isExpandable();

  /*
   * Function called when the drag event starts.
   *
   * @param event - The drag event generated.
   * @param node - The node that will be dragged.
   */
  handleDragStart(event : DragEvent, node : T ) {
    // Required by Firefox (https://stackoverflow.com/questions/19055264/why-doesnt-html5-drag-and-drop-work-in-firefox)
    event.dataTransfer.setData('foo', 'bar');
    event.dataTransfer.setDragImage(this.emptyItem.nativeElement, 0, 0);

    this.dragFlatNode = node;
    this.treeControl.collapse(node);
  }

  /*
   * Function called when the drag & drop flow is over.
   *
   * @param event - The drag event generated
   * @param node - The flat tree node dragged
   */
  handleDragOver(event, node : T ) {
    event.preventDefault();

    // Handle node expand
    if (node === this.dragNodeExpandOverNode) {
      if (this.dragFlatNode !== node && !this.treeControl.isExpanded(node)) {
        this.treeControl.expand(node);      
      }
    } else {
      this.dragNodeExpandOverNode = node;      
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

  /*
   * Function called when the node is dropped.
   *
   * @param event - The mouse event.
   * @param flatNode - The flat node dropped.
   */
  handleDrop(event : MouseEvent, flatNode: T) : void {    

    event.preventDefault();
    
    if (flatNode !== this.dragFlatNode) {
      
      /* If the are is above or below and the level is 0, it means the moved node should be a root. */
      if( (this.dragNodeExpandOverArea == "above" || this.dragNodeExpandOverArea == "below") && 
          this.dragNodeExpandOverNode.level == 0){
            this.dragNodeExpandOverNode = null;
      }

      /* Call save node */
      this.nodeMoved( this.dragNodeExpandOverNode, this.dragFlatNode );
      
    }

    /* Reset variables */
    this.dragFlatNode = null;
    this.dragNodeExpandOverNode = null;    
  }

  /*
   * Function called when the drag & drop is done.
   *
   * @param event - the drag event generated by the page.
   */
  handleDragEnd(event : MouseEvent) {
    this.dragFlatNode = null;
    this.dragNodeExpandOverNode = null;    
  }

  private _isRoot( flatTreeNode : T ) : boolean {
    return this.treeControl.dataNodes.some( c => c == flatTreeNode && c.level === 0 );
  }

  /*
   * This methos is called when a node is moved and dragged into the tree.
   * If this node was dragged over other one, then the target is represented by the parameter newRoot.
   * 
   * @param newRoot - The new root node where the node was dragged into. 
   *                  If the node was not dragged over other node, then this parameter is null.
   * @param node - The node that was moved.   * 
   */
  protected abstract nodeMoved( newRoot : T, node : T ) : void;

  /*
   * Returnes the children of an specific application node.
   *
   * @param node - The application node.
   * 
   * @returns The children of the node specified.
   */
  abstract getNodeChildren( node : O ) : O[];

  /*
   * Creates a flat tree node based on the application entity and an specific level.
   *
   * @param node - The application entity.
   * @param number - the node level.
   * 
   * @returns The new flat tree node created.
   */
  abstract createFlatTreeNode( node : O, level : number ) : T;
}