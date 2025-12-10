import {
  listsAtom,
  selectedListAtom,
  selectedListNumberAtom,
  updateSelectedListByFilePathAtom,
  viewModeAtom,
} from "@/atoms/lists";
import { OpenListMdFile } from "@/lib/wailsjs/go/application/App";
import {
  Button,
  createToaster,
  Heading,
  HStack,
  Icon,
  IconButton,
  Tabs,
  VStack,
} from "@chakra-ui/react";
import { useSetAtom } from "jotai";
import { useAtomValue } from "jotai";
import { useState } from "react";
import { LuFile, LuFolderOpen, LuPlus } from "react-icons/lu";
import { toaster, Toaster } from "@/components/ui/toaster";
import { useAtom } from "jotai";
import { Lists } from "./lists";
import { ViewToolbar } from "./toolbar";

const CleanSlateTab = () => {
  const updateSelectedList = useSetAtom(updateSelectedListByFilePathAtom);
  const [lists, setLists] = useAtom(listsAtom);
  const setViewMode = useSetAtom(viewModeAtom);
  return (
    <Tabs.Content value="cleanslate" p={0} h="100%" w="100%" asChild>
      <VStack
        justify="center"
        alignItems="center"
        color="fg.muted"
        userSelect="none"
        onClick={async () => {
          try {
            const newList = await OpenListMdFile();
            const currentListsWithSamePathIndex = lists.findIndex(
              (v) => v.metadata.file_path === newList.metadata.file_path,
            );

            if (currentListsWithSamePathIndex > -1) {
              updateSelectedList(
                lists[currentListsWithSamePathIndex].metadata.file_path,
              );
              return;
            }
            setLists((draft) => {
              draft.push(newList);
            });
            setViewMode((draft) => {
              draft[newList.metadata?.file_path] = "list";
            });
            updateSelectedList(newList.metadata?.file_path);
          } catch (err) {
            toaster.create({
              description: "Error open file:" + err,
              type: "error",
              closable: true,
            });
          }
        }}
      >
        <LuFile style={{ width: "10rem", height: "10rem" }} />
        <Heading fontSize={"5xl"} lineHeight={"tall"}>
          Open .list.md file
        </Heading>
        <Heading fontSize={"lg"} lineHeight={"tall"}>
          click here or drag and drop
        </Heading>
        <Toaster />
      </VStack>
    </Tabs.Content>
  );
};

export const Hierarchy = () => {
  const selectedList = useAtomValue(selectedListAtom);
  const lists = useAtomValue(listsAtom);

  return (
    <Tabs.Root
      value={selectedList ? selectedList.metadata.file_path : "cleanslate"}
      // onValueChange={}
      // @ts-ignore
      style={{ "--wails-draggable": "nodrag" }}
      variant="subtle"
      w="100%"
      flex={1}
      gap={0}
      p={0}
      lazyMount
      unmountOnExit
      position="relative"
    >
      <ViewToolbar />
      {lists.map((list, index) => (
        <Tabs.Content
          value={list.metadata.file_path}
          key={index}
          p={0}
          h="100%"
          w="100%"
          asChild
        >
          <Lists filePath={list.metadata.file_path} />
        </Tabs.Content>
      ))}

      <CleanSlateTab />
    </Tabs.Root>
  );
};
