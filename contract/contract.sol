// SPDX-License-Identifier: MIT

// pragma solidity >= 0.5.0 < 0.6.0;
// import "https://github.com/provable-things/ethereum-api/blob/master/provableAPI_0.5.sol";
// import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v2.5.0/contracts/token/ERC20/ERC20.sol";

pragma solidity ^0.6;
import "https://github.com/provable-things/ethereum-api/blob/master/provableAPI_0.6.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v3.0.0/contracts/token/ERC20/ERC20.sol";

contract myERC20Token is ERC20, usingProvable
{
    enum ActorType{
        Unassigned,
        Manager,
        Freelancer,
        Evaluator,
        Finantator
    }

    enum Category{
        Web,
        Desktop,
        Mobile,
        Console
    }

    enum TaskStatus{
        CREATED,
        FINANCED,
        PROGRESS,
        READY,
        DECLINED,
        JUDGING,
        DONE
    }

    struct UserType{
        bool isSet;
        ActorType actorType;
    }

    struct Manager{
        bool isSet;
        ActorType actorType;
        string nume;
        address managerAddr;
    }

    struct Freelancer{
        bool isSet;
        ActorType actorType;
        string nume;
        Category category;
        uint reputatie;
        address freelancerAddr;
    }

    struct Evaluator{
        bool isSet;
        ActorType actorType;
        string nume;
        Category category;
        uint reputatie;
        address evaluatorAddr;
    }

    struct Finantator{
        bool isSet;
        ActorType actorType;
        string nume;
        address finantatorAddr;
    }

    struct Task{
        uint taskIndex;
        bool isSet;
        bool isFunded;
        string description;
        uint256 RF;
        uint256 RE;
        uint256 totalFunding;
        address managerAddr;
        address evaluatorAddr;
        address freelancerAddr;
        address[] applyingFreelancersAddr;
        Category category;  
        TaskStatus taskStatus;  
    }

    struct FundingLedger{
        address finantatorAddr;
        uint fundingAmount;
    }

    struct TaskTimer {
        bool isSet;
        uint taskIndex;
        uint timerType;
    }

    mapping(address => UserType) public users;
    mapping(address => Freelancer) public freelancers;
    mapping(address => Evaluator) public evaluators;
    mapping(address => Manager) public managers;
    mapping(address => Finantator) public finantators;
    mapping(uint => FundingLedger[]) public finantatorsFundingEvidence;
    mapping(bytes32=>TaskTimer) public validIds;

    Task[] public tasks;
    string public timeNow;

    event newManagerCreated(address managerAddr, string nume);
    event newEvaluatorCreated(address evaluatorAddr, string nume, uint8 category);
    event newFinantatorCreated(address finantatorAddr, string nume);
    event newFreelancerCreated(address freelancerAddr, string nume, uint8 category);
    event TaskFinanced(uint taskIndex, address managerAddr);
    event TaskReady(uint taskIndex, address freelancerAddr, address managerAddr);
    event TaskJudging(uint taskIndex, address evaluatorAddr, address managerAddr);
    event TaskDone(uint taskIndex, address freelancerAddr, address managerAddr);
    event TaskDestroyed(uint taskIndex);
    event ApplyingFreelancers(uint taskIndex, address freelancerAddr, address managerAddr);
    event LogNewProvableQuery(string description);
    event LogTimeUpdated(string time);
    event fallbackCall(string description);
    event receivedFunds(address addr, uint amount);

    modifier notEnrolled{
        require(!(freelancers[msg.sender].isSet || evaluators[msg.sender].isSet || managers[msg.sender].isSet || finantators[msg.sender].isSet), "Already assigned!");
        _;
    }

    modifier isManager{
        require(managers[msg.sender].isSet, "You must be a manager!");
        _;
    }

    modifier isFinantator{
        require(finantators[msg.sender].isSet, "You must be a finantator!");
        _;
    }

    modifier isFreelancer{
        require(freelancers[msg.sender].isSet, "You must be a freelancer!");
        _;
    }

    modifier ownsTask(uint taskIndex){
        require(tasks[taskIndex].isSet, "Task doesn't exist!");
        require(tasks[taskIndex].managerAddr == msg.sender, "You are not the manager associated with the Task!");
        _;
    }

    constructor() public ERC20("token", "$") payable{
        provable_setCustomGasPrice(10000000000);
    }

    function getUserRole() public view returns(uint){
        return uint(users[msg.sender].actorType);
    }

    function newFreelancer(string memory name, uint8 category) public notEnrolled{
        freelancers[msg.sender] = Freelancer(true, ActorType.Freelancer, name, Category(category), 5, msg.sender);
        users[msg.sender] = UserType(true, ActorType.Freelancer);
        emit newFreelancerCreated(msg.sender, name, category);
    }

    function newEvaluator(string memory name, uint8 category) public notEnrolled{
        evaluators[msg.sender] = Evaluator(true, ActorType.Evaluator, name, Category(category), 5, msg.sender);
        users[msg.sender] = UserType(true, ActorType.Evaluator);
        emit newEvaluatorCreated(msg.sender, name, category);
    }

    function newManager(string memory name) public notEnrolled{
        managers[msg.sender] = Manager(true, ActorType.Manager, name, msg.sender);
        users[msg.sender] = UserType(true, ActorType.Manager);
        emit newManagerCreated(msg.sender, name);
    }

    function newFinantator(string memory name) public notEnrolled{
        finantators[msg.sender] = Finantator(true, ActorType.Finantator, name, msg.sender);
        users[msg.sender] = UserType(true, ActorType.Finantator);
        emit newFinantatorCreated(msg.sender, name);
    }

    function newTask(string memory description, uint256 RF, uint256 RE, uint8 category) public isManager{
        uint newTaskIndex = tasks.length;
        tasks.push(Task(newTaskIndex, true, false, description, RF, RE, 0, msg.sender, address(0x0), address(0x0), new address[](0), Category(category), TaskStatus.CREATED));
    }

    function getTasksArrayLength() public view returns(uint){
        return tasks.length;
    }

    function getManager(address inManagerAddr) public view returns(bool isSet, ActorType actorType, string memory nume, address managerAddr){
        return (managers[inManagerAddr].isSet, managers[inManagerAddr].actorType, managers[inManagerAddr].nume, managers[inManagerAddr].managerAddr);
    }

    function financeTask(uint256 taskIndex) public payable isFinantator{
        require(tasks[taskIndex].isSet, "Task doesn't exist!");
        require(tasks[taskIndex].isFunded == false, "Task already funded!");
        uint necessaryFunds = tasks[taskIndex].RF + tasks[taskIndex].RE - tasks[taskIndex].totalFunding;
        if(msg.value < necessaryFunds)
        {
            tasks[taskIndex].totalFunding += msg.value;
            finantatorsFundingEvidence[taskIndex].push(FundingLedger(msg.sender, msg.value)); 
        }else{
            tasks[taskIndex].isFunded = true;
            finantatorsFundingEvidence[taskIndex].push(FundingLedger(msg.sender, necessaryFunds));
            tasks[taskIndex].totalFunding += necessaryFunds;
            tasks[taskIndex].taskStatus = TaskStatus.FINANCED;
            emit TaskFinanced(taskIndex, tasks[taskIndex].managerAddr);
            payable(msg.sender).transfer(msg.value - necessaryFunds);
        }

    }

    function withdrawFunds(uint256 taskIndex, uint256 amount) public isFinantator {
        require(tasks[taskIndex].isSet && !tasks[taskIndex].isFunded, "You can't withdraw funds");

        for(uint256 i=0; i < finantatorsFundingEvidence[taskIndex].length; i++) {
            if(finantatorsFundingEvidence[taskIndex][i].finantatorAddr == msg.sender){
                if(finantatorsFundingEvidence[taskIndex][i].fundingAmount >= amount){
                    finantatorsFundingEvidence[taskIndex][i].fundingAmount -= amount;
                    tasks[taskIndex].totalFunding -= amount;
                    payable(msg.sender).transfer(amount);
                    break;
                }else{
                    revert();
                }
            }
        }
    }

    function getFinantatorsFundingEvLength(uint taskIndex) public view returns(uint) {
        return finantatorsFundingEvidence[taskIndex].length;
    }

    function destroyTask(uint taskIndex) public ownsTask(taskIndex){
        require(!tasks[taskIndex].isFunded, "Task can't be destroyed after funding phase");
        delete tasks[taskIndex];
        emit TaskDestroyed(taskIndex);
        for(uint i=0; i < finantatorsFundingEvidence[taskIndex].length; i++) {
            payable(finantatorsFundingEvidence[taskIndex][i].finantatorAddr).transfer(finantatorsFundingEvidence[taskIndex][i].fundingAmount);
        }
    }

    function chooseEvaluatorForTask(address evAddr, uint taskIndex) public ownsTask(taskIndex){
        require(tasks[taskIndex].isFunded, "Task must be funded!");
        require(evaluators[evAddr].isSet, "Address given is not associated with an evaluator!");
        require(tasks[taskIndex].category == evaluators[evAddr].category, "Evaluator category doesn't match with the task!");
        tasks[taskIndex].evaluatorAddr = evAddr;
        startTimerFreelancers(taskIndex);
    } 

    function applyForTask(uint taskIndex) public payable isFreelancer{
        require(tasks[taskIndex].evaluatorAddr != address(0x0), "Task must have an evaluator associated!");
        require(tasks[taskIndex].category == freelancers[msg.sender].category, "Your category doesn't match with the task!");
        require(tasks[taskIndex].freelancerAddr == address(0x0), "Task already has a freelancer associated!");
        if(msg.value < tasks[taskIndex].RE){
            revert();
        }else{
            tasks[taskIndex].applyingFreelancersAddr.push(msg.sender);
            emit ApplyingFreelancers(taskIndex, msg.sender, tasks[taskIndex].managerAddr);
            payable(msg.sender).transfer(msg.value - tasks[taskIndex].RE);
        }
    } 

    function chooseFreelancerForTask(uint taskIndex, uint freelancerIndex) public ownsTask(taskIndex){
        require(freelancers[tasks[taskIndex].applyingFreelancersAddr[freelancerIndex]].isSet, "Freelancer doesn't exist!");
        require(tasks[taskIndex].freelancerAddr == address(0x0), "Task already has a freelancer associated!");
        uint RE = tasks[taskIndex].RE;
        for(uint i=0; i<tasks[taskIndex].applyingFreelancersAddr.length; i++){
            if(i == freelancerIndex){
                tasks[taskIndex].freelancerAddr = tasks[taskIndex].applyingFreelancersAddr[freelancerIndex];
                tasks[taskIndex].taskStatus = TaskStatus.PROGRESS;
            }else{
                payable(tasks[taskIndex].freelancerAddr).transfer(RE);            
            }
        }
    }

    function getAllApplyingFreelancersForTask(uint taskIndex) public view returns(address[] memory addresses){
        return tasks[taskIndex].applyingFreelancersAddr;
    }

    function nominateTaskReady(uint taskIndex) public isFreelancer{
        require(tasks[taskIndex].freelancerAddr == msg.sender, "You are not associated to this task!");
        require(tasks[taskIndex].taskStatus == TaskStatus.PROGRESS, "The task is not in progress!");
        tasks[taskIndex].taskStatus = TaskStatus.READY;
        emit TaskReady(taskIndex, msg.sender, tasks[taskIndex].managerAddr);
    }

    function reviewTask(uint taskIndex, bool setTaskDone) public ownsTask(taskIndex){
        require(tasks[taskIndex].taskStatus == TaskStatus.READY, "Task is not ready yet!");
        if(setTaskDone){
            tasks[taskIndex].taskStatus = TaskStatus.DONE;
            if(freelancers[tasks[taskIndex].freelancerAddr].reputatie < 10){
                freelancers[tasks[taskIndex].freelancerAddr].reputatie += 1;
            }
            emit TaskDone(taskIndex, tasks[taskIndex].freelancerAddr, msg.sender);
            payable(tasks[taskIndex].freelancerAddr).transfer(tasks[taskIndex].RF + 2 * tasks[taskIndex].RE);
        }else{
            tasks[taskIndex].taskStatus = TaskStatus.JUDGING;
            startTimerEvaluator(taskIndex);
            emit TaskJudging(taskIndex, tasks[taskIndex].evaluatorAddr, msg.sender);
        }
    } 

    function evaluateTask(uint taskIndex, bool setTaskDone) public {
        require(msg.sender == tasks[taskIndex].evaluatorAddr, "You are not the evaluator assigned to this task!");
        require(tasks[taskIndex].taskStatus == TaskStatus.JUDGING, "The task is not in judging phase!");
        if(setTaskDone){
            tasks[taskIndex].taskStatus = TaskStatus.DONE;
            if(freelancers[tasks[taskIndex].freelancerAddr].reputatie < 10){
                freelancers[tasks[taskIndex].freelancerAddr].reputatie += 1;
            }
            payable(tasks[taskIndex].freelancerAddr).transfer(tasks[taskIndex].RF + tasks[taskIndex].RE); 
        }else{
            tasks[taskIndex].taskStatus = TaskStatus.DECLINED;
            if(freelancers[tasks[taskIndex].freelancerAddr].reputatie > 0){
                freelancers[tasks[taskIndex].freelancerAddr].reputatie -= 1;
            }
            for(uint i=0; i < finantatorsFundingEvidence[taskIndex].length; i++) {
                payable(finantatorsFundingEvidence[taskIndex][i].finantatorAddr).transfer(finantatorsFundingEvidence[taskIndex][i].fundingAmount);
            }
        }

        payable(msg.sender).transfer(tasks[taskIndex].RE);
    }

    function __callback(bytes32 _myid, string memory _result) public override{
        if (!validIds[_myid].isSet) revert();
        if (msg.sender != provable_cbAddress()) revert();
        timeNow = _result;
        //freelancer
        if(validIds[_myid].timerType == 0){
            if(tasks[validIds[_myid].taskIndex].applyingFreelancersAddr.length == 0){
                //nu a aplicat nimeni in timpul limita
                delete tasks[validIds[_myid].taskIndex];
                emit TaskDestroyed(validIds[_myid].taskIndex);
                for(uint i=0; i < finantatorsFundingEvidence[validIds[_myid].taskIndex].length; i++) {
                    payable(finantatorsFundingEvidence[validIds[_myid].taskIndex][i].finantatorAddr).transfer(finantatorsFundingEvidence[validIds[_myid].taskIndex][i].fundingAmount);
                }
            }
        }
        //evaluator
        else{
            //nu s-a luat decizia in timpul acordat
            if(tasks[validIds[_myid].taskIndex].taskStatus == TaskStatus.JUDGING){
                tasks[validIds[_myid].taskIndex].taskStatus = TaskStatus.DONE;
                for(uint i=0; i < finantatorsFundingEvidence[validIds[_myid].taskIndex].length; i++) {
                    payable(finantatorsFundingEvidence[validIds[_myid].taskIndex][i].finantatorAddr).transfer(finantatorsFundingEvidence[validIds[_myid].taskIndex][i].fundingAmount/2);
                }
                payable(tasks[validIds[_myid].taskIndex].freelancerAddr).transfer((tasks[validIds[_myid].taskIndex].RF + tasks[validIds[_myid].taskIndex].RE)/2 + tasks[validIds[_myid].taskIndex].RE);
            }

        }
        emit LogTimeUpdated(_result);
        delete validIds[_myid];
   }

   function startTimerFreelancers(uint taskIndex) public {
       if (provable_getPrice("URL") > address(this).balance) {
            emit LogNewProvableQuery("Provable query was NOT sent, please add some ETH to cover for the query fee");
            revert();
        } else {
            emit LogNewProvableQuery("Provable query was sent, standing by for the answer..");
            bytes32 queryId = provable_query(60,"URL", "json(https://api.pro.coinbase.com/products/ETH-USD/ticker).time");
            validIds[queryId] = TaskTimer(true, taskIndex, 0);
        }
   }

   function startTimerEvaluator(uint taskIndex) public {
       if (provable_getPrice("URL") > address(this).balance) {
            emit LogNewProvableQuery("Provable query was NOT sent, please add some ETH to cover for the query fee");
            revert();
        } else {
            emit LogNewProvableQuery("Provable query was sent, standing by for the answer..");
            bytes32 queryId = provable_query(60,"URL", "json(https://api.pro.coinbase.com/products/ETH-USD/ticker).time");
            validIds[queryId] = TaskTimer(true, taskIndex, 1);
        }
   }

    function deposit(uint256 amount) external payable{
        _mint(msg.sender, amount);
    }

    receive () external payable {
        emit receivedFunds(msg.sender, msg.value);
    }

    fallback () external payable {
        emit receivedFunds(msg.sender, msg.value);
    }

}

