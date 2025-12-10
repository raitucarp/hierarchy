import { useState } from "react";
import { VStack } from "@chakra-ui/react";
import { Titlebar } from "./components/titlebar";
import { ListMdTabs } from "./components/list-tabs";
import { Hierarchy } from "./components/hierarchy";

function App() {
  return (
    <VStack w="100%" h="100%" gap={0}>
      <Titlebar>
        <ListMdTabs />
      </Titlebar>
      <Hierarchy />
    </VStack>
  );
}

export default App;
