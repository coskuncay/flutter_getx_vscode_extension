import * as changeCase from "change-case";


export const generateControllerTemplate = (resourceName: string): string => {
  const pascalCaseName = changeCase.pascalCase(resourceName!.toLowerCase());
  const controllerTemplate: string = ` 
  import 'package:get/get.dart';
class ${pascalCaseName}Controller  extends GetxController {

}
  `;
  return controllerTemplate;
};

export const generateScreenTemplate = (resourceName: string): string => { 
  const snakeCaseName = changeCase.snakeCase(resourceName.toLowerCase());
  const pascalCaseName = changeCase.pascalCase(resourceName!.toLowerCase());
   
  const pageTemplate: string = `
import 'package:flutter/material.dart';  
import 'package:get/get.dart';
import './${snakeCaseName}_controller.dart';
class ${pascalCaseName}Screen extends GetView<${pascalCaseName}Controller> {
  const ${pascalCaseName}Screen({Key? key}) : super(key:key);
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('${resourceName}Screen'),
      ),
      body: SafeArea(
        child: Text('${resourceName}Controller'),
      ),
    );
  }
}
  `;

  return pageTemplate;
};

export const generateBindingTemplate = (resourceName: string): string => { 
  const snakeCaseName = changeCase.snakeCase(resourceName.toLowerCase());
  const pascalCaseName = changeCase.pascalCase(resourceName!.toLowerCase());
  const bindingTemplate: string = ` 
  import 'package:get/get.dart';
  import './${snakeCaseName}_controller.dart'; 
class ${pascalCaseName}Binding implements Bindings{
  @override
  void dependencies() {
    Get.lazyPut<${pascalCaseName}Controller>(() => ${pascalCaseName}Controller());
  }
}
  `;
  return bindingTemplate;
};
