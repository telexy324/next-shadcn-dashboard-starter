"use client";
import { Breadcrumbs } from "@/components/breadcrumbs";
import {
  Gantt,
  Task,
  EventOption,
  StylingOption,
  ViewMode,
  DisplayOption,
} from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import { tasks } from "@/constants/data";

const breadcrumbItems = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "Kanban", link: "/dashboard/kanban" },
];

export default function page() {
  // let tasks: Task[] = [
  //   {
  //     start: new Date(2020, 1, 1),
  //     end: new Date(2020, 1, 2),
  //     name: 'Idea',
  //     id: 'Task 0',
  //     type:'task',
  //     progress: 45,
  //     isDisabled: true,
  //     styles: { progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d' },
  //   },
  // ];
  return (
    <>
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <Breadcrumbs items={breadcrumbItems} />
        <Gantt tasks={tasks} />
      </div>
    </>
  );
}
