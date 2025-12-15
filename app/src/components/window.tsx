import { ButtonGroup, IconButton } from "@chakra-ui/react";
import { useAtomValue } from "jotai";
import { FC } from "react";
import {
  LuList,
  LuMinimize,
  LuMinus,
  LuNetwork,
  LuSearch,
  LuSquare,
  LuSun,
  LuSunMoon,
  LuX,
} from "react-icons/lu";

export const WindowControls: FC = () => {
  return (
    <ButtonGroup attached size="sm" variant="ghost" minW="10rem" justify="end">
      <IconButton aria-label="Exit Hierarchy" size="sm">
        <LuSun />
      </IconButton>
      <IconButton aria-label="Exit Hierarchy" size="sm">
        <LuMinus />
      </IconButton>
      <IconButton aria-label="Exit Hierarchy" size="sm">
        <LuSquare />
      </IconButton>
      <IconButton aria-label="Exit Hierarchy" size="sm">
        <LuX />
      </IconButton>
    </ButtonGroup>
  );
};
