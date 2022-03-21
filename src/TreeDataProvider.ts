import * as vscode from 'vscode';
import * as path from 'path';

export enum Type {
    DIR,
    FILE
};

type Node = FileNode | DirNode;

interface FileNode {
    type: Type.FILE;
    id: string
};

interface DirNode {
    type: Type.DIR;
    subnode: Record<string, Node>;
}

export const rootnode: DirNode = {
    type: Type.DIR,
    subnode: {
        "dirA": {
            type: Type.DIR,
            subnode: {
                "dirAa": {
                    type: Type.DIR,
                    subnode: {
                        "fileAaF": {
                            type: Type.FILE,
                            id: "dirA.dirAa.fileAaF"
                        }
                    }
                },
                "fileAF": {
                    type: Type.FILE,
                    id: "dirA.fileAF"
                }
            }
        },

        "dirB": {
            type: Type.DIR,
            subnode: {
                "dirBa": {
                    type: Type.DIR,
                    subnode: {
                        "fileBaF": {
                            type: Type.FILE,
                            id: "dirB.dirBa.fileBaF"
                        }
                    }
                },
                "fileBF": {
                    type: Type.FILE,
                    id: "dirB.fileBF"
                }
            }
        }
    }
}

export class NodeDependenciesProvider implements vscode.TreeDataProvider<Item> {
    constructor(private root: DirNode) { }

    getTreeItem(element: Item): vscode.TreeItem {
        return element;
    }

    getChildren(element?: Item): Thenable<Item[]> {
        if (element == null) {
            return Promise.resolve(this.populate(this.root));
        }

        if (element.node.type == Type.DIR) {
            return Promise.resolve(this.populate(element.node));
        } else {
            return Promise.resolve([]);
        }
    }

    private populate(node: DirNode): Item[] {
        const subs: Item[] = [];
        for (const [key, subnode] of Object.entries(node.subnode)) {
            subs.push(new Item(key, subnode));
        }
        return subs;
    }
}

class Item extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public node: Node,
    ) {
        super(label, node.type == Type.DIR ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None);
        if (this.node.type == Type.DIR) {
            this.tooltip = this.label;
        } else {
            this.tooltip = this.node.id;
            this.description = this.node.id;

            this.iconPath = {
                light: path.join(path.dirname(__filename), '..', 'media', 'elephant.svg'),
                dark: path.join(path.dirname(__filename), '..', 'media', 'elephant.svg'),
            };
        }
    }
}