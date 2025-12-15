import {
  Badge,
  Box,
  HStack,
  List,
  StackSeparator,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FC } from "react";
import { LuDot } from "react-icons/lu";
import { ScrollArea } from "@chakra-ui/react";
import { application, listmd } from "@/lib/wailsjs/go/models";
import {
  ListSelectedItems,
  SelectListItem,
} from "@/lib/wailsjs/go/application/App";
import { useQuery } from "@tanstack/react-query";
import { chain, keys } from "lodash";
import {
  buildNestedListFromSelectedList,
  flattenLists,
} from "@/utils/list-utils";
import { Resizable } from "re-resizable";
import Markdown from "react-markdown";
import rehype from "rehype-raw";
import remarkGfm from "remark-gfm";

const ListItem: FC<
  Omit<listmd.Node, "convertValues"> & { filePath: string }
> = ({ uid, filePath, markdown, children }) => {
  const {
    isPending,
    isError,
    isLoading,
    data: selectedItems,
    error,
  } = useQuery({
    queryKey: [application.QueryKey.ListSelectedItemsKey],
    queryFn: (): ReturnType<typeof ListSelectedItems> => {
      return ListSelectedItems(filePath);
    },
  });

  return (
    <List.Item
      key={uid}
      truncate
      _hover={{ bg: "bg.muted", cursor: "default" }}
      onClick={() => SelectListItem(filePath, uid)}
      bg={
        !selectedItems
          ? "unset"
          : selectedItems.includes(uid)
            ? "bg.emphasized"
            : "unset"
      }
      fontWeight={
        !selectedItems ? "unset" : selectedItems.includes(uid) ? "600" : "unset"
      }
      position="relative"
    >
      <List.Indicator asChild>
        <LuDot />
      </List.Indicator>
      {markdown}
      {children && children?.length > 0 && (
        <Badge
          position="absolute"
          right="3"
          top="1"
          size="xs"
          variant="surface"
        >
          {children?.length}
        </Badge>
      )}
    </List.Item>
  );
};

const ListItems: FC<{ list: listmd.Node[]; filePath: string }> = ({
  list,
  filePath,
}) => {
  return (
    <List.Root fontSize="md" w="100%">
      {list.map((listItem, index) => (
        <ListItem {...listItem} filePath={filePath} key={index} />
      ))}
    </List.Root>
  );
};

const ListGroup: FC<{ list: listmd.Node; filePath: string }> = ({
  list,
  filePath,
}) => {
  return (
    <VStack w="100%" alignItems="start" cursor="default" gap={0}>
      <HStack
        bg="bg.emphasized"
        w="100%"
        fontSize="sm"
        p="0.2rem"
        position="sticky"
        top="0"
        zIndex="100"
        gradientFrom={"bg.emphasized"}
        gradientTo={"bg.subtle"}
        bgGradient={"to-br"}
      >
        {list.id === -1 ? (
          <Text truncate>{list.children?.length} items</Text>
        ) : (
          <VStack w="100%" alignItems="start" p="0.5rem">
            <Markdown rehypePlugins={[rehype]} remarkPlugins={[remarkGfm]}>
              {list.markdown}
            </Markdown>
          </VStack>
        )}
      </HStack>
      {list.children && <ListItems list={list.children} filePath={filePath} />}
    </VStack>
  );
};

const ListLevel: FC<{
  lists: listmd.Node[];
  filePath: string;
  id: string;
}> = ({ lists, filePath, id }) => {
  return (
    <Resizable
      defaultSize={{ width: "15vw" }}
      minWidth={"12vw"}
      maxWidth={"18vw"}
    >
      <ScrollArea.Root
        height="calc(100dvh - 5rem) !important"
        flex={1}
        variant="always"
        // minWidth="10rem"
        // maxWidth="12rem"
        borderRight="2px solid"
        borderColor="border.muted"
      >
        <ScrollArea.Viewport>
          <VStack
            asChild
            gap={3}
            separator={
              <StackSeparator
                borderColor="border.emphasized"
                borderWidth="10px"
              />
            }
          >
            <ScrollArea.Content minW="100% !important">
              {lists.map((list, index) => (
                <ListGroup key={index} list={list} filePath={filePath} />
              ))}
            </ScrollArea.Content>
          </VStack>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar zIndex="101">
          <ScrollArea.Thumb />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
    </Resizable>
  );
};

const NestedList: FC<Omit<application.ListFile, "convertValues">> = ({
  metadata,
  lists,
  selectedListItems,
}) => {
  const newLists = buildNestedListFromSelectedList(selectedListItems, lists);

  return newLists.length > 0
    ? newLists.map((newList, index) => (
        <ListLevel
          key={`level-${index}`}
          lists={newList}
          filePath={metadata.file_path}
          id={`level-${index}`}
        />
      ))
    : null;
};

const BadgeListItemNumber: FC<{ uid: string }> = ({ uid }) => {
  const [, collection, ...tail] = uid.split("_");

  return (
    <Badge>
      {tail
        .map((v) => {
          return parseInt(v) + 1;
        })
        .join(".")}
    </Badge>
  );
};

const SelectedListItemView: FC<Omit<application.ListFile, "convertValues">> = ({
  metadata,
  lists,
  selectedListItems,
}) => {
  const listByCollection = chain(lists)
    .flatMap((list) => flattenLists(list))
    .filter((v) => selectedListItems.includes(v.uid))
    .groupBy((v) => {
      const [, collection] = v.uid.split("_");
      return parseInt(collection);
    })
    .value();

  return (
    <ScrollArea.Root height="calc(100% - 1rem)" w="100%" minW="50vw" size="sm">
      <ScrollArea.Viewport>
        <ScrollArea.Content spaceY="4" textStyle="sm">
          <VStack
            flex={1}
            h="100%"
            alignItems="start"
            separator={<StackSeparator />}
          >
            {keys(listByCollection).map((collection, index) => {
              return (
                <HStack
                  w="100%"
                  key={index}
                  p={"0.1rem"}
                  alignItems="start"
                  separator={<StackSeparator />}
                >
                  <Box
                    fontSize="1.2rem"
                    // p={1}
                  >
                    {parseInt(collection) + 1}
                  </Box>
                  <VStack flex={1} separator={<StackSeparator />}>
                    {listByCollection[collection].map((listItem, index) => (
                      <VStack w="100%" key={listItem.uid} alignItems="start">
                        <Markdown>{listItem.markdown}</Markdown>
                      </VStack>
                    ))}
                  </VStack>
                </HStack>
              );
            })}
          </VStack>
        </ScrollArea.Content>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar>
        <ScrollArea.Thumb />
      </ScrollArea.Scrollbar>
      <ScrollArea.Corner />
    </ScrollArea.Root>
  );
};

export const VList: FC<Omit<application.ListFile, "convertValues">> = (
  listFile,
) => {
  const { lists, metadata } = listFile;
  const {
    isPending,
    isError,
    isLoading,
    data: selectedListItems,
    error,
  } = useQuery({
    queryKey: [application.QueryKey.ListSelectedItemsKey],
    queryFn: (): ReturnType<typeof ListSelectedItems> => {
      return ListSelectedItems(metadata.file_path);
    },
  });

  const mainList = lists.flatMap(
    (v) =>
      ({
        id: -1,
        uid: "",
        markdown: "",
        children: v,
      }) as listmd.Node,
  );

  return (
    <HStack w="100%" h="100%" alignItems="stretch" justify="start">
      <ListLevel
        lists={mainList}
        filePath={metadata.file_path}
        id={"main-list"}
      />

      {selectedListItems && (
        <ScrollArea.Root
          h="calc(100dvh - 5rem) !important"
          variant="always"
          size="sm"
          overflowY="hidden"
        >
          <ScrollArea.Viewport overflowY="hidden">
            <ScrollArea.Content overflowY="hidden">
              <HStack w="100%" alignItems="start">
                <NestedList
                  {...listFile}
                  selectedListItems={selectedListItems}
                />
                <SelectedListItemView
                  {...listFile}
                  selectedListItems={selectedListItems}
                />
              </HStack>
            </ScrollArea.Content>
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar orientation="horizontal" zIndex="105" />
        </ScrollArea.Root>
      )}
    </HStack>
  );
};
