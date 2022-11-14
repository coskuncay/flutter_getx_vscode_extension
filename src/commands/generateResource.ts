import * as _ from "lodash";
import * as changeCase from "change-case";

import mkdirp = require("mkdirp");
import { InputBoxOptions, Uri, window, workspace } from "vscode";
import { existsSync, writeFile } from "fs";
import { generateBindingTemplate, generateControllerTemplate, generateScreenTemplate } from "../utils";


export const generateResource =  async (uri: Uri): Promise<void> => {

  if(workspace.workspaceFolders !== undefined) {
    let projectFolder = workspace.workspaceFolders[0].uri.fsPath;
    
    try {
    
      const resourceName = await promptForResourceName();
      if(!resourceName || resourceName.length === 0) {
        window.showErrorMessage("You must provide a resource name to generate the module");
        return;
      }
      const pascalCaseName = changeCase.pascalCase(resourceName!.toLowerCase());
      const snakeCaseName = changeCase.snakeCase(resourceName!.toLowerCase());
      const baseDirectory = `${projectFolder}/lib/modules`;

      await generateCode(pascalCaseName,snakeCaseName, baseDirectory);

      window.showInformationMessage(`FFFS ${resourceName} files successfully created 👏🏻👏🏻👏🏻🤘🏻`);
      
    } catch(err) {
      console.log(err);
      // window.showErrorMessage(err);
    }

  } else {
    window.showErrorMessage("Please open your project folder before continue");
  }
};

async function generateCode(
  resourceName: string,
  folderName: string,
  baseDirectory: string,
) { 

  const moduleFolder = `${baseDirectory}/${folderName}`; 

  if (!existsSync(moduleFolder)) {
    await mkdirp(moduleFolder);
  }
 

  const bindingTemplate = generateBindingTemplate(resourceName);
  const controllerTemplate = generateControllerTemplate(resourceName);
  const screenTemplate = generateScreenTemplate(resourceName);

  await Promise.all([
    createFile(folderName, moduleFolder, controllerTemplate, "controller"),
    createFile(folderName, moduleFolder, bindingTemplate, "binding"),
    createFile(folderName, moduleFolder, screenTemplate, "screen"),
  ]);
}


function promptForResourceName(): Thenable<string | undefined> {
  const resourceNamePromptOptions: InputBoxOptions = {
    prompt: "Enter Module Name",
    placeHolder: "home",
  };
  return window.showInputBox(resourceNamePromptOptions);
}

async function createFile(
  fileName: string, targetDirectory: string, fileTemplate: string,
  type: "controller" | "binding" | "screen"
): Promise<void> {

  const snakeCaseName = fileName;
  let targetPath: string;

  if(type === "binding") {
    targetPath = `${targetDirectory}/${snakeCaseName}_binding.dart`;
  } else if(type === "controller") {
    targetPath = `${targetDirectory}/${snakeCaseName}_controller.dart`;
  } else {
    targetPath = `${targetDirectory}/${snakeCaseName}_screen.dart`;
  }
  
  if (existsSync(targetPath)) {
    throw Error(`${snakeCaseName}.dart already exists`);
  }
 
  return new Promise<void>(async (resolve, reject) => {
    writeFile(
      targetPath,
      fileTemplate,
      "utf8",
      (error) => {
        if (error) {
          window.showErrorMessage(`${error}`);
          reject(error);
          return;
        }
        resolve();
      }
    );
  });
}

