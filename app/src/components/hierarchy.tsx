import {
  AllOpenedFiles,
  OpenListMdFile,
} from "@/lib/wailsjs/go/application/App";

import { Heading, Tabs, VStack } from "@chakra-ui/react";
import { FC } from "react";
import { LuFile } from "react-icons/lu";
import { useQuery } from "@tanstack/react-query";
import { size } from "lodash";
import { application } from "@/lib/wailsjs/go/models";
import { Lists } from "./lists";
import { ViewToolbar } from "./toolbar";

const CleanSlate = () => {
  return (
    <VStack
      h="100%"
      w="100%"
      justify="center"
      alignItems="center"
      color="fg.muted"
      userSelect="none"
      onClick={async () => {
        try {
          await OpenListMdFile();
        } catch (err) {}
      }}
    >
      <LuFile style={{ width: "10rem", height: "10rem" }} />
      <Heading fontSize={"5xl"} lineHeight={"tall"}>
        Open .list.md file
      </Heading>
      <Heading fontSize={"lg"} lineHeight={"tall"}>
        click here or drag and drop
      </Heading>
    </VStack>
  );
};

const HierarchyContents: FC<{
  openedFiles: Awaited<ReturnType<typeof AllOpenedFiles>>;
}> = ({ openedFiles }) => {
  return (
    openedFiles && (
      <Tabs.Root
        value={openedFiles.selected}
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
        id="tabs-content-main"
      >
        {openedFiles.files.map((listFile) => {
          return (
            <Tabs.Content
              value={listFile.metadata.file_path}
              key={listFile.metadata.file_path}
              h="100%"
              p={0}
            >
              <ViewToolbar {...listFile} />
              <Lists {...listFile} />
            </Tabs.Content>
          );
        })}
      </Tabs.Root>
    )
  );
};

export const Hierarchy = () => {
  const {
    isPending,
    isError,
    isLoading,
    data: openedFiles,
    error,
  } = useQuery({
    queryKey: [application.QueryKey.OpenedFilesKey],
    queryFn: (): ReturnType<typeof AllOpenedFiles> => {
      return AllOpenedFiles();
    },
  });

  if (isPending || isLoading) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  return openedFiles && size(openedFiles.files) > 0 ? (
    <HierarchyContents openedFiles={openedFiles} />
  ) : (
    <CleanSlate />
  );
};
