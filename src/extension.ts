import * as vscode from 'vscode';
import {  generateResource } from "./commands";
 
export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.commands.registerCommand("fffs.generateResource", generateResource),
	);
}

// This method is called when your extension is deactivated 
export function deactivate() {}