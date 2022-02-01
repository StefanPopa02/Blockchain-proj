const ACTOR_TYPES = {
    'UNASSIGNED'    : 0,
    'MANAGER'       : 1,
    'FREELANCER'    : 2,
    'EVALUATOR'     : 3,
    'FINANTATOR'    : 4
};

export function getActorTypeString(actorType){
    switch(actorType){
        case ACTOR_TYPES.UNASSIGNED:
            return "Unassigned";
        case ACTOR_TYPES.MANAGER:
            return "Manager";
        case ACTOR_TYPES.FREELANCER:
            return "Freelancer";
        case ACTOR_TYPES.EVALUATOR:
            return "Evaluator";
        case ACTOR_TYPES.FINANTATOR:
            return "Finantator";
        default:
            return "Unassigned";
    }
}

export default ACTOR_TYPES