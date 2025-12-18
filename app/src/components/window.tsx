import { Exit, ToggleMaximize } from "@/lib/wailsjs/go/application/App";
import { application } from "@/lib/wailsjs/go/models";
import {
  EventsOff,
  EventsOn,
  WindowMinimise,
} from "@/lib/wailsjs/runtime/runtime";
import { ButtonGroup, IconButton } from "@chakra-ui/react";
import { FC, useEffect, useState } from "react";
import { LuMinus, LuSquare, LuSquareSquare, LuX } from "react-icons/lu";
import { ColorModeButton } from "./ui/color-mode";

const MaximizeButton = () => {
  const [isMaximize, setIsMaximize] = useState<boolean>(true);

  useEffect(() => {
    EventsOn(application.Event.WindowMaximize, (_isMaximized: boolean) => {
      setIsMaximize(_isMaximized);
    });

    return () => {
      EventsOff(application.Event.WindowMaximize);
    };
  }, []);

  return (
    <IconButton aria-label="Restore" size="sm" onClick={() => ToggleMaximize()}>
      {isMaximize ? <LuSquare /> : <LuSquareSquare />}
    </IconButton>
  );
};

export const WindowControls: FC = () => {
  return (
    <ButtonGroup attached size="sm" variant="ghost" minW="10rem" justify="end">
      <ColorModeButton />
      <IconButton
        aria-label="Minimize Window"
        size="sm"
        onClick={() => WindowMinimise()}
      >
        <LuMinus />
      </IconButton>
      <MaximizeButton />
      <IconButton aria-label="Exit Hierarchy" size="sm" onClick={() => Exit()}>
        <LuX />
      </IconButton>
    </ButtonGroup>
  );
};
