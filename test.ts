import {
  Node,
  NodeFlags,
  Project,
  ReferenceFindableNode,
  Symbol,
  SyntaxKind,
  ts,
} from "ts-morph";

const project = new Project({
  skipFileDependencyResolution: true,
});

project.addSourceFilesAtPaths("./test-source/*.ts");
project.resolveSourceFileDependencies();

const foundIntlModule = project.getAmbientModule("react-intl-universal");

const intlGetDeclarations = foundIntlModule
  ?.getExport("get")
  ?.getDeclarations();

const [firstNodeOfGet] = intlGetDeclarations || [void 0];

if (firstNodeOfGet) {
  const referencedSymbolsOfGet = project
    .getLanguageService()
    .findReferences(firstNodeOfGet);

  for (const referencedSymbol of referencedSymbolsOfGet) {
    for (const reference of referencedSymbol.getReferences()) {
      const foundCallExpression = reference
        .getNode()
        .getParentIfKind(SyntaxKind.CallExpression);

      console.log(
        "找到的引用链文件路径: " + reference.getSourceFile().getFilePath()
      );
      if (foundCallExpression) {
        const [firstParamsChild] = foundCallExpression.getChildrenOfKind(
          SyntaxKind.SyntaxList
        );

        if (firstParamsChild) {
          console.log("参数内容", firstParamsChild.getText(), "\n");
        }
      }
    }
  }
}
