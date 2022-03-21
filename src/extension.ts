// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { NodeDependenciesProvider } from './TreeDataProvider';

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
  	<iframe src="http://localhost:3000"/>
  </body>
  </html>`;
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    // context.workspaceState.update('panel', null);
    let panel: null | vscode.WebviewPanel = null

    let disposable = vscode.commands.registerCommand('freki-cexplorer.helloWorld', () => {
        // let panel: null | vscode.WebviewPanel = context.workspaceState.get('panel') as vscode.WebviewPanel;
        if (panel == null) {
            panel = vscode.window.createWebviewPanel(
                'njla',
                'WTF',
                vscode.ViewColumn.Active, // Editor column to show the new webview panel in.
                {
                    enableScripts: true,
                } // Webview options. More on these later.
            );
            panel.onDidDispose(() => {
                panel = null;
                // context.workspaceState.update('panel', null);
            }, null, context.subscriptions);
            panel.webview.html = getWebviewContent();
            // context.workspaceState.update('panel', panel);
        }
    });

    const tree = new NodeDependenciesProvider("/home/njla/repo/vscode-ext/freki-cexplorer")

    vscode.window.createTreeView('nodeDependencies', {
        treeDataProvider: tree
    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }
