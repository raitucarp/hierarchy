import {
  listsByFilePathAtomFamily,
  selectedListViewModeAtom,
} from "@/atoms/lists";
import { VStack } from "@chakra-ui/react";
import { useAtomValue } from "jotai";
import { FC } from "react";
import { VList } from "./vlist";

export const Lists: FC<{ filePath: string }> = ({ filePath }) => {
  const selectedList = useAtomValue(listsByFilePathAtomFamily(filePath));
  const viewMode = useAtomValue(selectedListViewModeAtom);
  if (!selectedList) return null;
  return (
    <VStack
      justify="start"
      alignItems="start"
      zIndex="100"
      p="0.2rem"
      // flex={1}
      h="100%"
    >
      {viewMode === "list" && <VList {...selectedList} />}
    </VStack>
  );
};
