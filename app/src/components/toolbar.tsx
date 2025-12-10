import {
  selectedListAtom,
  selectedListViewModeAtom,
  setSelectedListViewModeAtom,
  viewModeAtom,
} from "@/atoms/lists";
import { ButtonGroup, HStack, IconButton } from "@chakra-ui/react";
import { useSetAtom } from "jotai";
import { useAtomValue } from "jotai";
import {
  LuChartColumn,
  LuChartLine,
  LuColumns3,
  LuFileChartLine,
  LuFolderTree,
  LuFoldHorizontal,
  LuGripHorizontal,
  LuGripVertical,
  LuIdCard,
  LuLayoutList,
  LuList,
  LuListTree,
  LuSun,
} from "react-icons/lu";

export const ViewToolbar = () => {
  const selectedList = useAtomValue(selectedListAtom);
  const viewMode = useAtomValue(selectedListViewModeAtom);
  const setViewMode = useSetAtom(setSelectedListViewModeAtom);

  return !selectedList ? null : (
    <HStack p="0.1rem" gap="0" justify="end" position="absolute" right="0">
      <ButtonGroup size="xs" variant="ghost" attached>
        <IconButton
          variant={viewMode === "list" ? "subtle" : "ghost"}
          onClick={() => setViewMode("list")}
        >
          <LuListTree />
        </IconButton>
        <IconButton
          variant={viewMode === "horizontal-list" ? "subtle" : "ghost"}
          onClick={() => setViewMode("horizontal-list")}
        >
          <LuColumns3 />
        </IconButton>
        <IconButton
          variant={viewMode === "tree" ? "subtle" : "ghost"}
          onClick={() => setViewMode("tree")}
        >
          <LuFolderTree />
        </IconButton>
        <IconButton
          variant={viewMode === "chart" ? "subtle" : "ghost"}
          onClick={() => setViewMode("chart")}
        >
          <LuChartLine />
        </IconButton>
        <IconButton
          variant={viewMode === "card" ? "subtle" : "ghost"}
          onClick={() => setViewMode("card")}
        >
          <LuIdCard />
        </IconButton>
      </ButtonGroup>
    </HStack>
  );
};
