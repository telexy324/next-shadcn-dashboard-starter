"use client";
import * as React from "react";
// import { Breadcrumbs } from '@/components/breadcrumbs';
import {
  Gantt,
  Task,
  EventOption,
  StylingOption,
  ViewMode,
  DisplayOption,
} from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import { ViewSwitcher } from "./vewSwitcher";
import { getStartEndDateForProject, initTasks } from "./helper";
import "gantt-task-react/dist/index.css";
import "./index.css";

// const breadcrumbItems = [
//   { title: 'Dashboard', link: '/dashboard' },
//   { title: 'Kanban', link: '/dashboard/kanban' }
// ];

// export default function page() {
//   return (
//     <>
//       {/*<div className="flex-1 space-y-4 p-4 pt-6 md:p-8">*/}
//       {/*  <Breadcrumbs items={breadcrumbItems} />*/}
//         <Gantt tasks={tasks} />
//       {/*</div>*/}
//     </>
//   );
// }

export default function Page() {
  type TaskListTableProps = {
    rowHeight: number;
    rowWidth: string;
    fontFamily: string;
    fontSize: string;
    locale: string;
    tasks: Task[];
    selectedTaskId: string;
    setSelectedTask: (taskId: string) => void;
    onExpanderClick: (task: Task) => void;
    handleAddTask: (task: Task) => void;
  };

  const TaskListTable = ({
    tasks,
    rowWidth,
    rowHeight,
    onExpanderClick,
    handleAddTask,
  }: TaskListTableProps) => {
    return (
      <div style={{ border: "1px solid #dfe1e5" }}>
        {tasks.map((item, i) => {
          const isProject = item.type === "project";
          return (
            <div
              key={item.id}
              style={{
                height: rowHeight,
                width: rowWidth,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: isProject ? "pointer" : "auto",
                fontFamily: "sans-serif",
                background: i % 2 === 0 ? "#ffffff" : "#f4f5f7",
                padding: 10,
                paddingLeft: isProject ? 10 : 40,
              }}
            >
              <p
                onClick={() => onExpanderClick(item)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  margin: 0,
                }}
              >
                {isProject ? "> " : ""}
                {item.name}
              </p>
              {isProject && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: 20,
                    height: 20,
                    padding: "3px",
                    backgroundColor: "#dfe1e5",
                    borderRadius: 5,
                  }}
                  onClick={() => handleAddTask(item)}
                >
                  +
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // Init
  const [view, setView] = React.useState<ViewMode>(ViewMode.Day);
  const [tasks, setTasks] = React.useState<Task[]>(initTasks());
  const [isChecked, setIsChecked] = React.useState(true);
  let columnWidth = 105;
  if (view === ViewMode.Year) {
    columnWidth = 350;
  } else if (view === ViewMode.Month) {
    columnWidth = 300;
  } else if (view === ViewMode.Week) {
    columnWidth = 250;
  }

  const handleTaskChange = (task: Task) => {
    console.log("On date change Id:" + task.id);
    let newTasks = tasks.map((t) => (t.id === task.id ? task : t));
    if (task.project) {
      const [start, end] = getStartEndDateForProject(newTasks, task.project);
      const project =
        newTasks[newTasks.findIndex((t) => t.id === task.project)];
      if (
        project.start.getTime() !== start.getTime() ||
        project.end.getTime() !== end.getTime()
      ) {
        const changedProject = { ...project, start, end };
        newTasks = newTasks.map((t) =>
          t.id === task.project ? changedProject : t,
        );
      }
    }
    setTasks(newTasks);
  };

  const handleTaskDelete = (task: Task) => {
    const conf = window.confirm("Are you sure about " + task.name + " ?");
    if (conf) {
      setTasks(tasks.filter((t) => t.id !== task.id));
    }
    return conf;
  };

  const handleProgressChange = async (task: Task) => {
    setTasks(tasks.map((t) => (t.id === task.id ? task : t)));
    console.log("On progress change Id:" + task.id);
  };

  const handleDblClick = (task: Task) => {
    alert("On Double Click event Id:" + task.id);
  };

  const handleClick = (task: Task) => {
    console.log("On Click event Id:" + task.id);
  };

  const handleSelect = (task: Task, isSelected: boolean) => {
    console.log(task.name + " has " + (isSelected ? "selected" : "unselected"));
  };

  const handleExpanderClick = (task: Task) => {
    setTasks(tasks.map((t) => (t.id === task.id ? task : t)));
    console.log(tasks.map((t) => (t.id === task.id ? task : t)));
    console.log("On expander click Id:" + task.id);
  };

  const handleAddTask = (task: Task) => {
    console.log(task);
    const currentDate = new Date();

    const newTasks: Task = {
      name: "new task",
      type: "task",
      progress: 100,
      id: new Date().getMilliseconds().toString(),
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 2),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 4, 0, 0),
      project: task.id,
    };
    setTasks((e) => [...e, newTasks]);
  };

  return (
    <div className="Wrapper">
      <ViewSwitcher
        onViewModeChange={(viewMode) => setView(viewMode)}
        onViewListChange={setIsChecked}
        isChecked={isChecked}
      />
      <h3>Gantt With Unlimited Height</h3>
      <Gantt
        tasks={tasks}
        viewMode={view}
        onDateChange={handleTaskChange}
        onDelete={handleTaskDelete}
        onProgressChange={handleProgressChange}
        onDoubleClick={handleDblClick}
        onClick={handleClick}
        onSelect={handleSelect}
        onExpanderClick={handleExpanderClick}
        listCellWidth={isChecked ? "295px" : ""}
        columnWidth={columnWidth}
        rowHeight={40}
        todayColor="rgba(246, 246, 247, .6)"
        timeStep={100}
        TaskListHeader={({ headerHeight }) => (
          <div
            style={{
              height: headerHeight,
              fontFamily: "sans-serif",
              fontWeight: "bold",
              paddingLeft: 10,
              margin: 0,
              marginBottom: -1,
              display: "flex",
              alignItems: "center",
            }}
          >
            Jobs
          </div>
        )}
        TaskListTable={(props) => (
          <TaskListTable {...props} handleAddTask={handleAddTask} />
        )}
      />
    </div>
  );
}
