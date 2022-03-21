// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import path = require('path');
import * as vscode from 'vscode';
import { NodeDependenciesProvider, rootnode, Type } from './TreeDataProvider';

function getWebviewContent() {
    return `<!DOCTYPE html>
  <html lang="en">
  <head>
	  <meta charset="UTF-8">
	  <meta name="viewport" content="width=device-width, initial-scale=1.0">
	  <title>Cat Coding</title>
	  <style>
	  	html {
			height: calc(100% - 10px);
			width: calc(100% - 40px);
		}
	  	body, 
		html > body > iframe {
			width: 100%;
			height: 100%;
		}
	  </style>
  </head>
  <body>
  	<iframe src="https://onuw-njaldea.vercel.app/3D"/>
  </body>
  </html>`;
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    // context.workspaceState.update('panel', null);
    let panels: Record<string, vscode.WebviewPanel> = {};
    let panel: null | vscode.WebviewPanel = null;

    let disposable = vscode.commands.registerCommand('freki-cexplorer.helloWorld', () => {
        if (panel == null) {
            panel = vscode.window.createWebviewPanel(
                'njla',
                'WTF',
                vscode.ViewColumn.Active,
                {
                    enableScripts: true,
                }
            );
            panel.onDidDispose(() => {
                panel = null;
            }, null, context.subscriptions);
            panel.webview.html = getWebviewContent();
        }
    });

    const treeview = vscode.window.createTreeView('nodeDependencies', {
        treeDataProvider: new NodeDependenciesProvider(context.extensionUri, rootnode)
    });
    treeview.onDidChangeSelection(e => {
        if (e.selection.length == 1) {
            const item = e.selection[0];
            if (item.node.type == Type.FILE) {
                const id = item.node.id;
                if (id in panels) {
                    const p = panels[id];
                    if (!p.visible) {
                        p.reveal(vscode.ViewColumn.Active);
                    }
                } else {
                    const p = vscode.window.createWebviewPanel(
                        'njla',
                        id,
                        vscode.ViewColumn.Active,
                        {
                            enableScripts: true,
                            retainContextWhenHidden: true,

                        }
                    );
                    p.onDidDispose(() => {
                        delete panels[id];
                    }, null, context.subscriptions);
                    p.webview.html = getWebviewContent();
                    p.iconPath = {
                        light: vscode.Uri.joinPath(context.extensionUri, "media", "elephant_light.svg"),
                        dark: vscode.Uri.joinPath(context.extensionUri, "media", "elephant_dark.svg"),
                    };
                    panels[id] = p;
                }
            }
        }
    }, null, context.subscriptions);

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }
