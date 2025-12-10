import { HStack } from "@chakra-ui/react";
import { FC, ReactNode } from "react";
import { WindowControls } from "./window";

export const Titlebar: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <HStack
      w="100%"
      justify="space-between"
      alignItems="start"
      // @ts-ignore
      style={{ "--wails-draggable": "drag" }}
    >
      {children}
      <WindowControls />
    </HStack>
  );
};
