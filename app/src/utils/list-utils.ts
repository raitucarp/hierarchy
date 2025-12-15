import { listmd } from "@/lib/wailsjs/go/models";
import { chain, omit } from "lodash";

export const buildNestedListFromSelectedList = (
  selectedList: string[],
  lists: listmd.Node[][],
) => {
  const selectedItemsByLevel = chain(selectedList)
    .groupBy((v) => v.split("_").length - 3)
    .value();

  const flatList = lists.flatMap((v) => flattenLists(v));

  const newLists = chain(selectedItemsByLevel)
    .keys()
    .map((level) => {
      const selectedLists = chain(selectedItemsByLevel[level])
        .sort()
        .map((uid) => {
          console.log({ uid, level, a: flatList.find((v) => v.uid == uid) });
          return flatList.find((v) => v.uid == uid);
        })
        .compact()
        .value();

      return selectedLists;
    })
    .value();

  return newLists;
};

export const flattenLists = (lists: listmd.Node[]) => {
  if (lists.length <= 0) return [];
  return chain(lists)
    .flatMapDeep((v) => v)
    .flatMapDeep((v) => {
      const list = [v];
      if (v.children) {
        list.push(...flattenLists(v.children));
      }
      return list;
    })
    .value();
};
