export enum State {
  missing,
  pending,
  success,
  failed
}
  
export interface Status {
  state: State,
  message: string
}


export interface DedicatedMsgSender {
  address: string,
  isDeployed:boolean,
  balance:string
}

export interface Chain {
  name:string,
  id:number
}


export interface Message {
  header:string,
  body:string | undefined, 
  taskId:string | undefined
}

export enum TaskState {
  Pending = 'Pending',
  CheckPending = 'CheckPending',
  ExecPending = 'ExecPending',
  WaitingForConfirmation = 'WaitingForConfirmation',
  ExecSuccess = 'ExecSuccess',
  ExecReverted = 'ExecReverted',
  Blacklisted = 'Blacklisted',
  Cancelled = 'Cancelled',
  NotFound = 'NotFound',
}