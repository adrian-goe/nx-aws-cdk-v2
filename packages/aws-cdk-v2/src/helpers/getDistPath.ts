export function getDistPath(projectName: string) {
  console.log(JSON.stringify(process.env));
  return `${process.env.NX_WORKSPACE_ROOT}/dist/${projectName}`;
}
