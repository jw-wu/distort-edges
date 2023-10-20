/* Types */           import * as type from "../../library/figma/system/typegroups";

// Returns a boolean based on whether node is nested within an instance,
// a string of non-zero length containing the instance id,
// and the path to the reference layer within the component.
export function withinInstance(node: SceneNode): { true: boolean, instanceId: string, path: number[] } {

  let result = false,
      instanceId = "",
      path: number[] = [ ],
      currentTarget: SceneNode = node;

  do {

    let parentId: string = (currentTarget.parent!) ? currentTarget.parent.id : "";
    let parent = figma.currentPage.findOne((n) => (n.id === parentId)) || figma.currentPage;

    if (parent.type !== "PAGE" && type.isParentable(parent)) {

      path.push(parent.children.indexOf(currentTarget));

      if (parent.type === "INSTANCE") {
        result = true;
        instanceId = parent.id;
        break;
      }
  
      else {
        currentTarget = parent;
      }

    }

    else break;

  } while (!result);

  path.reverse();

  return { true: result, instanceId: instanceId, path: path };

}