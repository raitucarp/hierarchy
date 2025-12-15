import { useEffect, useState } from "react";
import { VStack } from "@chakra-ui/react";
import { Titlebar } from "./components/titlebar";
// import { ListMdTabs } from "./components/list-tabs";
import { Hierarchy } from "./components/hierarchy";
import { useQueryClient } from "@tanstack/react-query";
import { EventsOn } from "./lib/wailsjs/runtime/runtime";
import { application } from "./lib/wailsjs/go/models";
import { ListMdTabs } from "./components/list-tabs";
import { Toaster } from "./components/ui/toaster";

function App() {
  const queryClient = useQueryClient();

  useEffect(() => {
    EventsOn(application.Event.ReloadAllOpenedFiles, () => {
      queryClient.invalidateQueries({
        queryKey: [application.QueryKey.OpenedFilesKey],
      });
    });

    EventsOn(application.Event.ReloadSelectedItems, () => {
      queryClient.invalidateQueries({
        queryKey: [application.QueryKey.ListSelectedItemsKey],
      });
    });
  }, []);

  return (
    <VStack w="100%" h="100%" gap={0}>
      <Titlebar>
        <ListMdTabs />
      </Titlebar>
      <Hierarchy />

      <Toaster />
    </VStack>
  );
}

export default App;
