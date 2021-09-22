import uniqBy from 'lodash/uniqBy';

import { state, TreeNode, TreeNodeType } from '@/store/tree';
import {
  getCurrentNode,
  orderByNameASC,
  rangeNodes,
} from '@/store/tree/helper';

export function setParent(parent: TreeNode) {
  for (const node of parent.children) {
    node.parent = parent;
    setParent(node);
  }
  return parent;
}

export function orderByTreeNodeASC(node: TreeNode) {
  const sortNodes: TreeNode[] = [];
  const [folders, files] = node.children.reduce<
    [Array<TreeNode>, Array<TreeNode>]
  >(
    ([folders, files], node) => {
      node.type === TreeNodeType.folder ? folders.push(node) : files.push(node);
      return [folders, files];
    },
    [[], []]
  );
  folders.sort(orderByNameASC);
  files.sort(orderByNameASC);
  sortNodes.push(...folders, ...files);
  node.children = sortNodes;
}

export function open(node: TreeNode) {
  node.open = true;
}

export function close(node: TreeNode) {
  node.open = false;
}

export function focusin() {
  state.focus = true;
}

export function focusout() {
  state.focus = false;
}

export function selectNode(
  node: TreeNode | null,
  ctrlKey = false,
  shiftKey = false
) {
  if (node && state.lastSelectNode && (ctrlKey || shiftKey)) {
    const nodes = [...state.root.iterVisible()];
    const index = nodes.findIndex(v => v.id === node.id);
    const lastIndex = nodes.findIndex(v => v.id === state.lastSelectNode?.id);

    if (ctrlKey && shiftKey) {
      state.selectNodes = uniqBy(
        [...state.selectNodes, ...rangeNodes(index, lastIndex, nodes)],
        'id'
      );
    } else if (ctrlKey) {
      state.selectNodes = uniqBy([...state.selectNodes, node], 'id');
    } else if (shiftKey) {
      state.selectNodes = uniqBy(rangeNodes(index, lastIndex, nodes), 'id');
    }
  } else {
    state.selectNodes = node ? [node] : [];
  }
  state.lastSelectNode = node;
}

export function selectMoveNext() {
  const currentNode = getCurrentNode();
  if (!currentNode) return;
  let nextNode: TreeNode | null = null;
  let isCurrent = false;

  for (const node of state.root.iterVisible()) {
    if (isCurrent) {
      nextNode = node;
      break;
    }

    if (node.id === currentNode.id) {
      isCurrent = true;
    }
  }

  state.selectNodes = nextNode
    ? [nextNode]
    : state.root.children.length
    ? [state.root.children[0]]
    : [];
  state.lastSelectNode = nextNode
    ? nextNode
    : state.root.children.length
    ? state.root.children[0]
    : null;
}

export function selectMovePrev() {
  const currentNode = getCurrentNode();
  if (!currentNode) return;
  let prevNode: TreeNode | null = null;

  for (const node of state.root.iterVisible()) {
    if (node.id === currentNode.id) {
      break;
    } else {
      prevNode = node;
    }
  }

  if (prevNode && prevNode.type !== TreeNodeType.root) {
    state.selectNodes = [prevNode];
    state.lastSelectNode = prevNode;
  } else {
    const nodes = [...state.root.iterVisible()];
    state.selectNodes = nodes.length ? [nodes[nodes.length - 1]] : [];
    state.lastSelectNode = nodes.length ? nodes[nodes.length - 1] : null;
  }
}

export function startRename() {
  const currentNode = getCurrentNode();
  if (!currentNode) return;
  state.oldName = currentNode.name;
  state.selectNodes = [currentNode];
  currentNode.edit = true;
}

export function endRename(node: TreeNode) {
  if (!node.name.trim()) {
    node.name = state.oldName;

    if (state.newNode) {
      state.newNode.parent?.children.splice(
        state.newNode.parent.children.findIndex(
          node => node.id === state.newNode?.id
        ),
        1
      );
      state.lastSelectNode = null;
      state.selectNodes = [];
    }
  }

  node.parent && orderByTreeNodeASC(node.parent);
  node.edit = false;
  state.oldName = '';
  state.newNode = null;
}

export function newFile() {
  const newNode = new TreeNode({
    node: { type: TreeNodeType.file, edit: true },
  });
  let parent = state.root;

  if (state.lastSelectNode && state.lastSelectNode.parent) {
    parent = state.lastSelectNode;
    if (state.lastSelectNode.type === TreeNodeType.file) {
      parent = state.lastSelectNode.parent;
    }
  }

  const index = parent.children.findIndex(
    node => node.type === TreeNodeType.file
  );
  if (index === -1) {
    parent.children.push(newNode);
  } else {
    parent.children.splice(index, 0, newNode);
  }

  parent.open = true;
  newNode.parent = parent;
  state.newNode = newNode;
  state.lastSelectNode = newNode;
  state.selectNodes = [newNode];
}

export function newFolder() {
  const newNode = new TreeNode({
    node: { type: TreeNodeType.folder, edit: true },
  });
  let parent = state.root;

  if (state.lastSelectNode && state.lastSelectNode.parent) {
    parent = state.lastSelectNode;
    if (state.lastSelectNode.type === TreeNodeType.file) {
      parent = state.lastSelectNode.parent;
    }
  }

  parent.children.unshift(newNode);
  parent.open = true;
  newNode.parent = parent;
  state.newNode = newNode;
  state.lastSelectNode = newNode;
  state.selectNodes = [newNode];
}

export function remove() {
  for (const node of state.selectNodes) {
    node.parent?.children.splice(
      node.parent.children.findIndex(v => v.id === node.id),
      1
    );
  }
}
