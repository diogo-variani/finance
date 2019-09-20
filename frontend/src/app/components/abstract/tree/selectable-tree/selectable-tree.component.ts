import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeNode, DraggableTreeComponent } from '../draggable-tree/draggable-tree.component';

export abstract class SelectableTreeComponent<O, T extends FlatTreeNode> extends DraggableTreeComponent<O, T> {

  /** The selection for checklist */
  selection : SelectionModel<string> = new SelectionModel<string>(false /* multiple */);

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: T): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.selection.isSelected(this.getNodeId( child )));
    return result;
  }

  /*
   * It retrieves the node id, which is used as key by the selection model.
   *
   * @param node - The node related to the id retrieved.
   * @returns the id related to the node.
   */
  protected abstract getNodeId( node : T ) : string;
}