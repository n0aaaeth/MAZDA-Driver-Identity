import axios from "axios";
import { Subject, interval } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { TaskState } from "../types/taskStatus";

type GetGelatoRelayStatusParams = {
  taskIdToQuery: string | undefined
}

export const getGelatoRelayStatus = ({taskIdToQuery}: GetGelatoRelayStatusParams) => {
  if (!taskIdToQuery) {
    return Promise.reject(new Error("taskIdToQuery is undefined"));
  }

  const destroyFetchTask = new Subject<void>();
  const pollingInterval = interval(1000).pipe(takeUntil(destroyFetchTask));

  return new Promise((resolve, reject) => {
    pollingInterval.subscribe(async () => {
      try {
        const { data } = await axios.get(
          `https://relay.gelato.digital/tasks/status/${taskIdToQuery}`
        );
        const { taskState } = data.task;

        if (taskState === TaskState.ExecSuccess) {
          completeTask(destroyFetchTask, resolve, data.task);
        } else if (isTaskFailed(taskState)) {
          completeTask(destroyFetchTask, () =>
            reject(new Error(`Task failed with state: ${taskState}`))
          );
        }
      } catch (error) {
        completeTask(destroyFetchTask, () => reject(error));
      }
    });
  });
};

const isTaskFailed = (taskState: TaskState) => {
  return [
    TaskState.Cancelled,
    TaskState.ExecReverted,
    TaskState.NotFound,
    TaskState.Blacklisted,
  ].includes(taskState);
};

const completeTask = (
  destroyFetchTask: Subject<void>,
  action: Function,
  result?: any
) => {
  destroyFetchTask.next();
  destroyFetchTask.complete();
  action(result);
};
