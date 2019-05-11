import React, { useMemo } from 'react';
import { TodoTask } from '../../Task';
import { Schema$Task } from '../../../typings';
import { compare } from '../../../utils/compare';

interface Props {
  todoTasks: Schema$Task[];
}

const inputBaseProps = {
  inputProps: {
    hideDateBtn: true
  }
};

export function TodoTasksListSortByDate({ todoTasks }: Props) {
  let index = -1;

  const sortedTodoTasks = useMemo(() => {
    const dateLabelHandler = getDateLabelHandler();
    let prevLabel = '';
    return todoTasks
      .slice()
      .sort(
        (a, b) =>
          compare(a.due, b.due) ||
          compare(a.position, b.position) ||
          compare(a.updated, b.updated)
      )
      .reduce<Array<string | Schema$Task>>((acc, task) => {
        const label = dateLabelHandler(task.due);
        if (prevLabel !== label) {
          prevLabel = label;
          acc.push(label);
        }

        acc.push(task);
        return acc;
      }, []);
  }, [todoTasks]);

  return (
    <div className="todo-tasks-list-sort-by-date">
      {sortedTodoTasks.map(data => {
        if (typeof data === 'string') {
          return <div className="date-label" data-label={data} key={data} />;
        }

        index += 1;

        return (
          <TodoTask
            key={data.uuid}
            index={index}
            task={data}
            inputBaseProps={inputBaseProps}
          />
        );
      })}
    </div>
  );
}

function getDateLabelHandler() {
  const now = new Date();
  return (due?: string) => {
    let key = 'No date';

    if (due) {
      const date = new Date(due);
      const dayDiff = Math.floor((+now - +date) / 1000 / 60 / 60 / 24);

      if (dayDiff > 0) {
        key = 'Past';
      } else if (dayDiff === 0) {
        key = 'Today';
      } else if (dayDiff === -1) {
        key = 'Tomorrow';
      } else if (dayDiff < -1) {
        key = 'Due ' + date.format('D, j M');
      }
    }

    return key;
  };
}
