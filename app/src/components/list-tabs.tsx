import {
  AllOpenedFiles,
  ChangeSelectedFile,
  OpenListMdFile,
} from "@/lib/wailsjs/go/application/App";
import { Button, Icon, IconButton, Tabs } from "@chakra-ui/react";
import { LuPlus } from "react-icons/lu";
import { toaster } from "./ui/toaster";
import { useQuery } from "@tanstack/react-query";
import { size } from "lodash";
import { application } from "@/lib/wailsjs/go/models";

const openListMdFile = async () => {
  try {
    await OpenListMdFile();
  } catch (err) {
    toaster.create({
      description: "Error open file:" + err,
      type: "error",
      closable: true,
    });
  }
};

const OpenListMdFileButton = () => {
  return (
    <Button variant="ghost" size="xs" onClick={openListMdFile}>
      <Icon size="xs">
        <LuPlus />
      </Icon>
      Open list.md
    </Button>
  );
};

export const ListMdTabs = () => {
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

  return openedFiles && size(openedFiles.files) > 0 ? (
    <Tabs.Root
      value={openedFiles.selected}
      onValueChange={async (e) => {
        try {
          await ChangeSelectedFile(e.value);
        } catch (err) {}
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
        {openedFiles.files.map((file, index) => (
          <Tabs.Trigger value={file.metadata.file_path} key={index}>
            {file.metadata.name}
          </Tabs.Trigger>
        ))}

        {size(openedFiles.files) > 0 ? (
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
          <OpenListMdFileButton />
        )}
      </Tabs.List>
    </Tabs.Root>
  ) : (
    <OpenListMdFileButton />
  );
};
