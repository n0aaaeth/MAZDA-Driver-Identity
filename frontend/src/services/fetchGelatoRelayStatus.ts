import axios from "axios";
import { Subject, interval, takeUntil } from "rxjs";
import { TaskState } from "../types/taskStatus";

export const fetchGelatoRelayStatus = (taskIdToQuery: string | undefined) => {
  return new Promise((resolve, reject) => {
    if (!taskIdToQuery) {
      return reject(new Error("taskIdToQuery is undefined"));
    }

    const destroyFetchTask: Subject<void> = new Subject();
    const numbers = interval(1000);
    const takeFourNumbers = numbers.pipe(takeUntil(destroyFetchTask));

    takeFourNumbers.subscribe(async () => {
      try {
        const res = await axios.get(`https://relay.gelato.digital/tasks/status/${taskIdToQuery}`);
        const status = res.data.task;

        if (status.taskState === TaskState.ExecSuccess) {
          destroyFetchTask.next();
          destroyFetchTask.complete();
          resolve(status); // 'ExecSuccess' ステータス時にステータスを解決して返す
        } else if ([TaskState.Cancelled, TaskState.ExecReverted, TaskState.NotFound, TaskState.Blacklisted].includes(status.taskState)) {
          destroyFetchTask.next();
          destroyFetchTask.complete();
          reject(new Error(`Task failed with state: ${status.taskState}`)); // エラー状態で拒否を返す
        }
        // 他のcaseは必要に応じて追加...
      } catch (error) {
        destroyFetchTask.next();
        destroyFetchTask.complete();
        reject(error); // 例外発生時に拒否を返す
      }
    });
  });
};

