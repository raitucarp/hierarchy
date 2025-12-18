import { ChangeViewMode } from "@/lib/wailsjs/go/application/App";
import { application } from "@/lib/wailsjs/go/models";
import {
  ButtonGroup,
  HStack,
  IconButton,
  Input,
  InputGroup,
} from "@chakra-ui/react";
import { FC } from "react";
import {
  LuChartLine,
  LuCircleDotDashed,
  LuColumns3,
  LuFolderTree,
  LuIdCard,
  LuListTree,
  LuNetwork,
} from "react-icons/lu";

export const ViewToolbar: FC<Omit<application.ListFile, "convertValues">> = ({
  viewMode,
  metadata,
}) => {
  return (
    <HStack p="0.2rem" gap="2" justify="space-between">
      <InputGroup
        startElement="file://"
        startElementProps={{ color: "fg.muted" }}
      >
        <Input
          ps="7ch"
          placeholder="yoursite.com"
          value={metadata.file_path}
          size="xs"
        />
      </InputGroup>

      <ButtonGroup size="xs" variant="ghost" attached>
        <IconButton
          variant={
            viewMode === application.ViewMode.VListViewMode ? "subtle" : "ghost"
          }
          onClick={() =>
            ChangeViewMode(
              metadata.file_path,
              application.ViewMode.VListViewMode,
            )
          }
        >
          <LuListTree />
        </IconButton>
        <IconButton
          variant={
            viewMode === application.ViewMode.HListViewMode ? "subtle" : "ghost"
          }
          onClick={() => {}}
        >
          <LuColumns3 />
        </IconButton>
        <IconButton
          variant={
            viewMode === application.ViewMode.TreeViewMode ? "subtle" : "ghost"
          }
          onClick={() => {}}
        >
          <LuFolderTree />
        </IconButton>
        <IconButton
          variant={
            viewMode === application.ViewMode.ChartViewMode ? "subtle" : "ghost"
          }
          onClick={() => {}}
        >
          <LuChartLine />
        </IconButton>
        <IconButton
          variant={
            viewMode === application.ViewMode.CardViewMode ? "subtle" : "ghost"
          }
          onClick={() => {}}
        >
          <LuIdCard />
        </IconButton>
        <IconButton
          variant={
            viewMode === application.ViewMode.GraphViewMode ? "subtle" : "ghost"
          }
          onClick={() => {
            ChangeViewMode(
              metadata.file_path,
              application.ViewMode.GraphViewMode,
            );
          }}
        >
          <LuCircleDotDashed />
        </IconButton>
      </ButtonGroup>
    </HStack>
  );
};
