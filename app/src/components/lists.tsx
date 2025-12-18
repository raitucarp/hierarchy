import { application } from "@/lib/wailsjs/go/models";
import { VStack } from "@chakra-ui/react";
import { FC } from "react";
import { VList } from "./vlist";
import { GraphView } from "./graph";

export const Lists: FC<Omit<application.ListFile, "convertValues">> = (
  listFile,
) => {
  const { viewMode } = listFile;

  return (
    <VStack justify="start" zIndex="100" p="0.2rem" h="100%">
      {viewMode === application.ViewMode.VListViewMode && (
        <VList {...listFile} />
      )}
      {viewMode === application.ViewMode.GraphViewMode && (
        <GraphView {...listFile} />
      )}
    </VStack>
  );
};
