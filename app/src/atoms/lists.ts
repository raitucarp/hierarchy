// import { listmd } from "@/lib/wailsjs/go/models";
// import { current } from "immer";
// import { atom } from "jotai";
// import { atomWithImmer } from "jotai-immer";
// import { atomFamily } from "jotai/utils";
// import { selectAtom } from "jotai/utils";
// import { chain } from "lodash";

// export type List = {
//   id: number;
//   uid: string;
//   markdown: string;
//   children: List[];
// };

// export type ListMetadata = {
//   name: string;
//   file_path: string;
//   layout: "vertical" | "horizontal";
// };

// export type ViewMode = "list" | "horizontal-list" | "tree" | "chart" | "card";
// export type ListMd = Omit<listmd.ListMd, "metadata"> & {
//   metadata: ListMetadata;
// };

// export const selectedListNumberAtom = atom<number | null>(null);
// export const viewModeAtom = atomWithImmer<Record<string, ViewMode>>({});
// export const listsAtom = atomWithImmer<ListMd[]>([]);

// export const listsByFilePathAtomFamily = atomFamily((filePath: string) =>
//   atom((get) => {
//     const lists = get(listsAtom);
//     const listsByPathIndex = lists.findIndex(
//       (v) => v.metadata.file_path === filePath,
//     );
//     if (listsByPathIndex < 0) return;
//     return lists[listsByPathIndex];
//   }),
// );

// export const updateSelectedListByFilePathAtom = atom(
//   null,
//   (get, set, filePath: string) => {
//     const lists = get(listsAtom);
//     const listByNameIndex = lists.findIndex(
//       (v) => v.metadata.file_path === filePath,
//     );

//     if (typeof listByNameIndex === "undefined") return;

//     set(selectedListNumberAtom, listByNameIndex);
//   },
// );

// export const selectedListAtom = atom((get) => {
//   const selectedListNumber = get(selectedListNumberAtom);
//   if (selectedListNumber === null || typeof selectedListNumber === "undefined")
//     return;

//   const lists = get(listsAtom);

//   return lists[selectedListNumber];
// });

// export const selectedListViewModeAtom = atom((get) => {
//   const selectedList = get(selectedListAtom);
//   if (!selectedList) return;

//   const filePath = selectedList.metadata.file_path;
//   const viewMode = get(viewModeAtom);
//   return viewMode[filePath];
// });

// export const setSelectedListViewModeAtom = atom(
//   null,
//   (get, set, mode: ViewMode) => {
//     const selectedList = get(selectedListAtom);
//     if (!selectedList) return;

//     set(viewModeAtom, (draft) => {
//       draft[selectedList.metadata.file_path] = mode;
//     });
//   },
// );

// type LevelItemSelected = Record<number, string[]>;
// export const selectedListItemAtom = atomWithImmer<
//   Record<string, LevelItemSelected>
// >({});

// export const listOfSelectedAtom = atom((get) => {
//   const selectedList = get(selectedListAtom);
//   if (!selectedList) return;

//   const filePath = selectedList.metadata.file_path;
//   const selectedListItem = get(selectedListItemAtom);
//   if (!selectedListItem[filePath]) return;

//   return selectedListItem[filePath];
// });

// export const selectListItemAtom = atom(null, (get, set, uid: string) => {
//   const selectedList = get(selectedListAtom);
//   if (!selectedList) return;

//   const filePath = selectedList.metadata.file_path;
//   const splittedUid = uid.split("_");
//   const level = splittedUid.length - 3;
//   const [, collection] = splittedUid;
//   const collectionNumber = parseInt(collection);

//   set(selectedListItemAtom, (draft) => {
//     if (!draft[filePath]) {
//       draft[filePath] = {};
//     }

//     if (!draft[filePath][level]) {
//       draft[filePath][level] = [];
//     }

//     let uidToRemoved: string | undefined;

//     if (
//       draft[filePath][level][collectionNumber] &&
//       draft[filePath][level].includes(uid)
//     ) {
//       const indexOfItem = draft[filePath][level].findIndex((v) => v === uid);

//       if (indexOfItem !== -1) {
//         draft[filePath][level].splice(indexOfItem, 1);
//         uidToRemoved = uid;
//       }
//     } else {
//       const previousUid = draft[filePath][level][collectionNumber];
//       if (previousUid) {
//         uidToRemoved = previousUid;
//       }

//       draft[filePath][level][collectionNumber] = uid;
//     }

//     if (uidToRemoved) {
//       Object.keys(draft[filePath]).map((level) => {
//         const levelInt = parseInt(level);
//         const childrenIndex = draft[filePath][levelInt].findIndex((v) =>
//           new RegExp(`^${uidToRemoved}`, "ig").test(v),
//         );

//         if (childrenIndex !== -1) {
//           draft[filePath][levelInt].splice(childrenIndex, 1);
//         }
//       });
//     }
//   });
// });

// export const isItemSelectedListItemAtom = atomFamily((uid: string) =>
//   atom((get) => {
//     const selectedList = get(selectedListAtom);
//     if (!selectedList) return false;

//     const filePath = selectedList.metadata.file_path;
//     const selectedListItem = get(selectedListItemAtom);

//     if (!selectedListItem) return false;

//     const splittedUid = uid.split("_");
//     const level = splittedUid.length - 3;
//     const [, collection] = splittedUid;
//     const collectionNumber = parseInt(collection);

//     if (!selectedListItem[filePath]) return false;
//     if (!selectedListItem[filePath][level]) return false;
//     if (!selectedListItem[filePath][level][collectionNumber]) return false;

//     return selectedListItem[filePath][level][collectionNumber] === uid;
//   }),
// );

// const flattenLists = (lists: listmd.Node[]) => {
//   if (lists.length <= 0) return [];
//   return chain(lists)
//     .flatMapDeep((v) => v)
//     .flatMapDeep((v) => {
//       const list = [v];
//       if (v.children) {
//         list.push(...flattenLists(v.children));
//       }
//       return list;
//     })
//     .value();
// };
// export const flattenListsAtom = atom((get) => {
//   const selectedList = get(selectedListAtom);
//   if (!selectedList) return [];
//   if (!selectedList.lists) return [];

//   return selectedList.lists.flatMap((list) => flattenLists(list));
// });

// export const metadataAtom = atom((get) => {
//   const selectedList = get(selectedListAtom);
//   if (!selectedList) return;
//   if (!selectedList.metadata) return;

//   return selectedList.metadata;
// });
