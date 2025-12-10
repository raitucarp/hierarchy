import {
  ListMd,
  listsByFilePathAtomFamily,
  selectListItemAtom,
  selectedListAtom,
  isItemSelectedListItemAtom,
  selectedListViewModeAtom,
  viewModeAtom,
  listOfSelectedAtom,
  ListMetadata,
  flattenListsAtom,
} from "@/atoms/lists";
import {
  Badge,
  Box,
  ButtonGroup,
  HStack,
  IconButton,
  List,
  StackSeparator,
  Text,
  useCollapsible,
  VStack,
} from "@chakra-ui/react";
import { useAtomValue } from "jotai";
import { FC, ReactNode, useCallback, useRef, useState } from "react";
import {
  LuArrowDown,
  LuArrowDownFromLine,
  LuArrowDownToDot,
  LuChevronDown,
  LuChevronUp,
  LuDot,
  LuSearch,
} from "react-icons/lu";
import {
  ImperativePanelHandle,
  Panel,
  PanelGroup,
  PanelResizeHandle,
} from "react-resizable-panels";
import { ScrollArea } from "@chakra-ui/react";
import { listmd } from "@/lib/wailsjs/go/models";
import { useSetAtom } from "jotai";
import { chain, compact, flatten, get, size } from "lodash";

export const PanelResizeHorizontal = () => {
  return (
    <Box asChild w="0.2rem" h="100%" bgColor="border.subtle">
      <PanelResizeHandle />
    </Box>
  );
};

export const PanelResizeVertical = () => {
  return (
    <Box asChild h="1px" w="100%" bgColor="border.emphasized">
      <PanelResizeHandle />
    </Box>
  );
};

const ListItem: FC<Omit<listmd.Node, "convertValues">> = ({
  uid,
  markdown,
  children,
}) => {
  const isItemSelected = useAtomValue(isItemSelectedListItemAtom(uid));
  const selectListItem = useSetAtom(selectListItemAtom);

  return (
    <List.Item
      key={uid}
      truncate
      _hover={{ bg: "bg.muted" }}
      borderLeft="2px solid"
      borderColor="border.muted"
      p="0.1rem"
      position="relative"
      fontSize="md"
      bgColor={isItemSelected ? "bg.emphasized" : "unset"}
      onClick={() => {
        selectListItem(uid);
      }}
    >
      <List.Indicator asChild>
        <LuDot />
      </List.Indicator>
      {markdown}
      {children && (
        <Badge
          size="xs"
          position="absolute"
          right="0.3rem"
          top="1"
          rounded="full"
          variant="subtle"
        >
          {children?.length}
        </Badge>
      )}
    </List.Item>
  );
};

const ListPanel: FC<Omit<listmd.Node, "convertValues">> = ({
  children,
  markdown,
  uid,
  id,
}) => {
  const panelRef = useRef<ImperativePanelHandle>(null);
  const [collapse, setCollapse] = useState<boolean>(false);
  const togglePanel = () => {
    const panel = panelRef.current;

    if (!panel) return;
    if (panel.isCollapsed()) {
      setCollapse(false);
      panel.expand();
      return;
    }

    if (panel.isExpanded()) {
      setCollapse(true);
      panel.collapse();
      return;
    }
  };

  const order = chain(uid).split("_").nth(-2).value();

  return (
    <>
      {children && children.length > 0 && (
        <HStack
          w="100%"
          bg="bg.muted"
          fontSize="xs"
          fontWeight="bold"
          p="0.2rem"
          justify="space-between"
          position="sticky"
          top="0rem"
          zIndex="100"
        >
          <Text as="span" truncate>
            {id === -1 ? `${children?.length} items` : markdown}{" "}
          </Text>

          <ButtonGroup size="xs" variant="ghost" p="0" attached>
            {children.length > 1 && (
              <IconButton>
                <LuSearch />
              </IconButton>
            )}
            <IconButton onClick={togglePanel}>
              {collapse ? <LuChevronDown /> : <LuChevronUp />}
            </IconButton>
          </ButtonGroup>
        </HStack>
      )}

      <VStack
        w="100%"
        minH={collapse ? "0" : "min-content"}
        maxH={collapse ? "0" : "max-content"}
        asChild
      >
        <Panel
          collapsible
          minSize={10}
          collapsedSize={0}
          id={uid}
          order={parseInt(order)}
          ref={panelRef}
        >
          {children && children.length > 0 ? (
            <List.Root w="100%" userSelect="none" gap={1}>
              {children?.map((v) => (
                <ListItem key={v.uid} {...v} />
              ))}
            </List.Root>
          ) : (
            <Box p="0.5rem" bg="bg.muted" fontSize="sm" fontFamily="monospace">
              {markdown}
            </Box>
          )}
        </Panel>
      </VStack>
    </>
  );
};

const ListPanelGroup: FC<{ name: string; children: ReactNode }> = ({
  name,
  children,
}) => {
  return (
    <PanelGroup
      direction="vertical"
      autoSaveId={`persistance-layout-${name}-list`}
    >
      <ScrollArea.Root variant="always" height="calc(100vh - 3rem)">
        <ScrollArea.Viewport>
          <ScrollArea.Content h="100%" minW="100% !important">
            <VStack separator={<PanelResizeVertical />}>{children}</VStack>
          </ScrollArea.Content>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar zIndex={101} />
      </ScrollArea.Root>
    </PanelGroup>
  );
};

export const VSelectedLists: FC<{
  lists: listmd.Node[][];
  metadata: ListMetadata;
}> = ({ lists, metadata }) => {
  const listOfSelected = useAtomValue(listOfSelectedAtom);
  const flattenLists = useAtomValue(flattenListsAtom);

  return listOfSelected
    ? Object.keys(listOfSelected)
        .map((level, index) => {
          const selectedItems = listOfSelected[parseInt(level)];
          if (compact(selectedItems).length <= 0) return null;

          const selectedList = chain(selectedItems)
            .compact()
            .map((uid) => {
              return flattenLists.find((list) => list.uid === uid)!;
            })
            .compact()
            .value();

          if (selectedList.length <= 0) return null;

          return (
            <VStack asChild key={index} alignItems="start">
              <Panel
                minSize={10}
                maxSize={20}
                collapsedSize={5}
                collapsible={false}
                id={`list-level-${level}`}
                order={parseInt(level) + 1}
              >
                <ListPanelGroup name={`${metadata.name}-${level}`}>
                  {selectedList.map(
                    ({ uid, id, markdown, children }, index) => (
                      <ListPanel
                        uid={uid}
                        id={id}
                        markdown={markdown}
                        children={children!}
                        key={index}
                      />
                    ),
                  )}
                </ListPanelGroup>
              </Panel>
            </VStack>
          );
        })
        .flatMap((child, index) => [
          child,
          index < Object.keys(listOfSelected).length - 1 ? (
            <PanelResizeHorizontal key={`sep-${index}`} />
          ) : null,
        ])
    : null;
};

export const MainVList: FC<Omit<listmd.ListMd, "convertValues">> = ({
  metadata,
  lists,
}) => {
  return (
    <VStack asChild>
      <Panel
        minSize={10}
        maxSize={20}
        collapsedSize={5}
        collapsible={false}
        id="main-list"
        order={0}
      >
        <ListPanelGroup name={metadata.name}>
          {lists!
            .filter((list) => list.length > 0)
            .map((list, index) => (
              <ListPanel
                children={list}
                markdown={""}
                uid="item_ _ _"
                id={-1}
                key={index}
              />
            ))}
        </ListPanelGroup>
      </Panel>
    </VStack>
  );
};

export const VList: FC<ListMd> = (listMd) => {
  const { metadata, lists } = listMd;
  return (
    <PanelGroup
      direction="horizontal"
      autoSaveId={`persistance-layout-${metadata.name}`}
    >
      <HStack
        w="100%"
        separator={<PanelResizeHorizontal />}
        alignItems="stretch"
      >
        <MainVList lists={lists!} metadata={metadata} />
        <VSelectedLists lists={lists!} metadata={metadata} />

        <VStack asChild h="100%">
          <Panel id="preview">{metadata.file_path}</Panel>
        </VStack>
      </HStack>
    </PanelGroup>
  );
};
