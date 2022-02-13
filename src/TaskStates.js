const TASK_STATUS = {
    'CREATED'   : 0,
    'FINANCED'  : 1,
    'CERTIFIED' : 2,
    'PROGRESS'  : 3,
    'READY'     : 4,
    'DECLINED'  : 5,
    'JUDGING'   : 6,
    'DONE'      : 7
}

export function getTaskStatesString(taskStatus){
    switch(taskStatus){
        case TASK_STATUS.CREATED:
            return 'Created';
        case TASK_STATUS.FINANCED:
            return 'Financed';
        case TASK_STATUS.CERTIFIED:
            return 'Certified';
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