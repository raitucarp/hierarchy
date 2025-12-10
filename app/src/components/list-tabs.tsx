import {
  listsAtom,
  selectedListAtom,
  selectedListNumberAtom,
  updateSelectedListByFilePathAtom,
  viewModeAtom,
} from "@/atoms/lists";
import { OpenListMdFile } from "@/lib/wailsjs/go/application/App";
import { Button, HStack, Icon, IconButton, Tabs } from "@chakra-ui/react";
import { useSetAtom } from "jotai";
import { useAtomValue } from "jotai";
import { useState } from "react";
import { LuPlus } from "react-icons/lu";
import { toaster } from "./ui/toaster";

export const ListMdTabs = () => {
  const updateSelectedList = useSetAtom(updateSelectedListByFilePathAtom);
  const selectedList = useAtomValue(selectedListAtom);
  const lists = useAtomValue(listsAtom);
  const setLists = useSetAtom(listsAtom);
  const setViewMode = useSetAtom(viewModeAtom);

  const openListMdFile = async () => {
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
  };

  return (
    <Tabs.Root
      value={selectedList ? selectedList.metadata.file_path : "cleanslate"}
      onValueChange={(e) => {
        if (selectedList) {
          updateSelectedList(e.value);
        }
      }}
      // @ts-ignore
      style={{ "--wails-draggable": "nodrag" }}
      variant="subtle"
      gap={0}
      p={0}
      size={"sm"}
      flex={1}
      lazyMount
      unmountOnExit
    >
      <Tabs.List alignItems="center" m={0} p={"0.1rem"} borderBottom="0">
        {lists.map((list, index) => (
          <Tabs.Trigger value={list.metadata.file_path} key={index}>
            {list.metadata.name}
          </Tabs.Trigger>
        ))}

        {lists.length > 0 ? (
          <IconButton
            aria-label="add"
            size="xs"
            variant="ghost"
            ml="1rem"
            onClick={openListMdFile}
          >
            <LuPlus />
          </IconButton>
        ) : (
          <Button variant="ghost" size="xs" onClick={openListMdFile}>
            <Icon size="xs">
              <LuPlus />
            </Icon>
            Open list.md
          </Button>
        )}
      </Tabs.List>
    </Tabs.Root>
  );
};
