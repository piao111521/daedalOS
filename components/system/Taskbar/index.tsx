import { AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { memo, useCallback, useState } from "react";
import Clock from "components/system/Taskbar/Clock";
import StartButton from "components/system/Taskbar/StartButton";
import StyledTaskbar from "components/system/Taskbar/StyledTaskbar";
import TaskbarEntries from "components/system/Taskbar/TaskbarEntries";
import useTaskbarContextMenu from "components/system/Taskbar/useTaskbarContextMenu";
import { FOCUSABLE_ELEMENT } from "utils/constants";

const Calendar = dynamic(() => import("components/system/Taskbar/Calendar"));
const StartMenu = dynamic(() => import("components/system/StartMenu"));

const Taskbar: FC = () => {
  const [startMenuVisible, setStartMenuVisible] = useState(false);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const toggleStartMenu = useCallback(
    (showMenu?: boolean): void =>
      setStartMenuVisible((currentMenuState) => showMenu ?? !currentMenuState),
    []
  );
  const toggleCalendar = useCallback(
    (showCalendar?: boolean): void =>
      setCalendarVisible(
        (currentCalendarState) => showCalendar ?? !currentCalendarState
      ),
    []
  );

  return (
    <>
      <AnimatePresence initial={false} presenceAffectsLayout={false}>
        {startMenuVisible && <StartMenu toggleStartMenu={toggleStartMenu} />}
      </AnimatePresence>
      <StyledTaskbar {...useTaskbarContextMenu()} {...FOCUSABLE_ELEMENT}>
        <StartButton
          startMenuVisible={startMenuVisible}
          toggleStartMenu={toggleStartMenu}
        />
        <TaskbarEntries />
        <Clock toggleCalendar={toggleCalendar} />
      </StyledTaskbar>
      <AnimatePresence initial={false} presenceAffectsLayout={false}>
        {calendarVisible && <Calendar toggleCalendar={toggleCalendar} />}
      </AnimatePresence>
    </>
  );
};

export default memo(Taskbar);
