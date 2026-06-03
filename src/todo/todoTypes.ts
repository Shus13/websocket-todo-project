

export enum Status{
    Completed = 'completed',
    Pending = 'pending'
}

export interface IToDo{
    task: string,
    deadline: string,
    status: Status
}