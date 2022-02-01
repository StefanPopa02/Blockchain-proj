const TASK_STATUS = {
    'CREATED'   : 0,
    'FINANCED'  : 1,
    'PROGRESS'  : 2,
    'READY'     : 3,
    'DECLINED'  : 4,
    'JUDGING'   : 5,
    'DONE'      : 6
}

export function getTaskStatesString(taskStatus){
    switch(taskStatus){
        case TASK_STATUS.CREATED:
            return 'Created';
        case TASK_STATUS.FINANCED:
            return 'Financed';
        case TASK_STATUS.PROGRESS:
            return 'In Progress';
        case TASK_STATUS.READY:
            return 'Ready';
        case TASK_STATUS.DECLINED:
            return 'Declined';
        case TASK_STATUS.JUDGING:
            return 'Judging';
        case TASK_STATUS.DONE:
            return 'Done';
        default:
            return 'Not Created';
    }
}

export default TASK_STATUS