import Web3 from 'web3';
import ACTOR_TYPES from '../ActorTypes';

let selectedAccount;
let isInitialized = false;
let marketContract;
let web3 = null;

export const init = async () => {
	let provider = window.ethereum;

	if (typeof provider !== 'undefined') {
		const accounts = await provider.request({ method: 'eth_requestAccounts' });
        selectedAccount = accounts[0];
	
		window.ethereum.on('accountsChanged', function (accounts) {
			selectedAccount = accounts[0];
			console.log(`Selected account changed to ${selectedAccount}`);
            window.location.href = "http://localhost:3000/";
		});
	}

	web3 = new Web3(provider);

	const marketAbi = [
        {
            "inputs": [],
            "stateMutability": "payable",
            "type": "constructor"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "taskIndex",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "freelancerAddr",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "managerAddr",
                    "type": "address"
                }
            ],
            "name": "ApplyingFreelancers",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "spender",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "value",
                    "type": "uint256"
                }
            ],
            "name": "Approval",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "description",
                    "type": "string"
                },
                {
                    "indexed": false,
                    "internalType": "bytes32",
                    "name": "queryId",
                    "type": "bytes32"
                }
            ],
            "name": "LogNewProvableQuery",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "time",
                    "type": "string"
                }
            ],
            "name": "LogTimeUpdated",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "taskIndex",
                    "type": "uint256"
                }
            ],
            "name": "TaskDeclined",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "taskIndex",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "freelancerAddr",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "managerAddr",
                    "type": "address"
                }
            ],
            "name": "TaskDone",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "taskIndex",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "managerAddr",
                    "type": "address"
                }
            ],
            "name": "TaskFinanced",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "taskIndex",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "evaluatorAddr",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "managerAddr",
                    "type": "address"
                }
            ],
            "name": "TaskJudging",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "taskIndex",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "freelancerAddr",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "managerAddr",
                    "type": "address"
                }
            ],
            "name": "TaskReady",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "value",
                    "type": "uint256"
                }
            ],
            "name": "Transfer",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "description",
                    "type": "string"
                }
            ],
            "name": "fallbackCall",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "evaluatorAddr",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "nume",
                    "type": "string"
                },
                {
                    "indexed": false,
                    "internalType": "uint8",
                    "name": "category",
                    "type": "uint8"
                }
            ],
            "name": "newEvaluatorCreated",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "finantatorAddr",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "nume",
                    "type": "string"
                }
            ],
            "name": "newFinantatorCreated",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "freelancerAddr",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "nume",
                    "type": "string"
                },
                {
                    "indexed": false,
                    "internalType": "uint8",
                    "name": "category",
                    "type": "uint8"
                }
            ],
            "name": "newFreelancerCreated",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "managerAddr",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "nume",
                    "type": "string"
                }
            ],
            "name": "newManagerCreated",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "addr",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "receivedFunds",
            "type": "event"
        },
        {
            "stateMutability": "payable",
            "type": "fallback"
        },
        {
            "inputs": [
                {
                    "internalType": "bytes32",
                    "name": "_myid",
                    "type": "bytes32"
                },
                {
                    "internalType": "string",
                    "name": "_result",
                    "type": "string"
                }
            ],
            "name": "__callback",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "bytes32",
                    "name": "_myid",
                    "type": "bytes32"
                },
                {
                    "internalType": "string",
                    "name": "_result",
                    "type": "string"
                },
                {
                    "internalType": "bytes",
                    "name": "_proof",
                    "type": "bytes"
                }
            ],
            "name": "__callback",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "spender",
                    "type": "address"
                }
            ],
            "name": "allowance",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "taskIndex",
                    "type": "uint256"
                }
            ],
            "name": "applyForTask",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "spender",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "approve",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "account",
                    "type": "address"
                }
            ],
            "name": "balanceOf",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "balanceOfContract",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "evAddr",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "taskIndex",
                    "type": "uint256"
                }
            ],
            "name": "chooseEvaluatorForTask",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "taskIndex",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "freelancerIndex",
                    "type": "uint256"
                }
            ],
            "name": "chooseFreelancerForTask",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "decimals",
            "outputs": [
                {
                    "internalType": "uint8",
                    "name": "",
                    "type": "uint8"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "spender",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "subtractedValue",
                    "type": "uint256"
                }
            ],
            "name": "decreaseAllowance",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "taskIndex",
                    "type": "uint256"
                }
            ],
            "name": "destroyTask",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "taskIndex",
                    "type": "uint256"
                },
                {
                    "internalType": "bool",
                    "name": "setTaskDone",
                    "type": "bool"
                }
            ],
            "name": "evaluateTask",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "evaluators",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "isSet",
                    "type": "bool"
                },
                {
                    "internalType": "enum Utils.ActorType",
                    "name": "actorType",
                    "type": "uint8"
                },
                {
                    "internalType": "string",
                    "name": "nume",
                    "type": "string"
                },
                {
                    "internalType": "enum Utils.Category",
                    "name": "category",
                    "type": "uint8"
                },
                {
                    "internalType": "address",
                    "name": "evaluatorAddr",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "exchange",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "taskIndex",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "financeTask",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "finantators",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "isSet",
                    "type": "bool"
                },
                {
                    "internalType": "enum Utils.ActorType",
                    "name": "actorType",
                    "type": "uint8"
                },
                {
                    "internalType": "string",
                    "name": "nume",
                    "type": "string"
                },
                {
                    "internalType": "address",
                    "name": "finantatorAddr",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "finantatorsFundingEvidence",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "finantatorAddr",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "fundingAmount",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "freelancers",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "isSet",
                    "type": "bool"
                },
                {
                    "internalType": "enum Utils.ActorType",
                    "name": "actorType",
                    "type": "uint8"
                },
                {
                    "internalType": "string",
                    "name": "nume",
                    "type": "string"
                },
                {
                    "internalType": "enum Utils.Category",
                    "name": "category",
                    "type": "uint8"
                },
                {
                    "internalType": "uint256",
                    "name": "reputatie",
                    "type": "uint256"
                },
                {
                    "internalType": "address",
                    "name": "freelancerAddr",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "fundContract",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "taskIndex",
                    "type": "uint256"
                }
            ],
            "name": "getAllApplyingFreelancersForTask",
            "outputs": [
                {
                    "internalType": "address[]",
                    "name": "addresses",
                    "type": "address[]"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "taskIndex",
                    "type": "uint256"
                }
            ],
            "name": "getFinantatorsFundingEvLength",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "inManagerAddr",
                    "type": "address"
                }
            ],
            "name": "getManager",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "isSet",
                    "type": "bool"
                },
                {
                    "internalType": "enum Utils.ActorType",
                    "name": "actorType",
                    "type": "uint8"
                },
                {
                    "internalType": "string",
                    "name": "nume",
                    "type": "string"
                },
                {
                    "internalType": "address",
                    "name": "managerAddr",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "getTasksArrayLength",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "getUserRole",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "spender",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "addedValue",
                    "type": "uint256"
                }
            ],
            "name": "increaseAllowance",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "managers",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "isSet",
                    "type": "bool"
                },
                {
                    "internalType": "enum Utils.ActorType",
                    "name": "actorType",
                    "type": "uint8"
                },
                {
                    "internalType": "string",
                    "name": "nume",
                    "type": "string"
                },
                {
                    "internalType": "address",
                    "name": "managerAddr",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "name",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "name",
                    "type": "string"
                },
                {
                    "internalType": "uint8",
                    "name": "category",
                    "type": "uint8"
                }
            ],
            "name": "newEvaluator",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "name",
                    "type": "string"
                }
            ],
            "name": "newFinantator",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "name",
                    "type": "string"
                },
                {
                    "internalType": "uint8",
                    "name": "category",
                    "type": "uint8"
                }
            ],
            "name": "newFreelancer",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "name",
                    "type": "string"
                }
            ],
            "name": "newManager",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "description",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "RF",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "RE",
                    "type": "uint256"
                },
                {
                    "internalType": "uint8",
                    "name": "category",
                    "type": "uint8"
                }
            ],
            "name": "newTask",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "taskIndex",
                    "type": "uint256"
                }
            ],
            "name": "nominateTaskReady",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "taskIndex",
                    "type": "uint256"
                },
                {
                    "internalType": "bool",
                    "name": "setTaskDone",
                    "type": "bool"
                }
            ],
            "name": "reviewTask",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "taskIndex",
                    "type": "uint256"
                }
            ],
            "name": "startTimerEvaluator",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "taskIndex",
                    "type": "uint256"
                }
            ],
            "name": "startTimerFreelancers",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "symbol",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "tasks",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "taskIndex",
                    "type": "uint256"
                },
                {
                    "internalType": "bool",
                    "name": "isSet",
                    "type": "bool"
                },
                {
                    "internalType": "bool",
                    "name": "isFunded",
                    "type": "bool"
                },
                {
                    "internalType": "string",
                    "name": "description",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "RF",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "RE",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "totalFunding",
                    "type": "uint256"
                },
                {
                    "internalType": "address",
                    "name": "managerAddr",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "evaluatorAddr",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "freelancerAddr",
                    "type": "address"
                },
                {
                    "internalType": "enum Utils.Category",
                    "name": "category",
                    "type": "uint8"
                },
                {
                    "internalType": "enum Utils.TaskStatus",
                    "name": "taskStatus",
                    "type": "uint8"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "timeNow",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "totalSupply",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "recipient",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "transfer",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "sender",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "recipient",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "transferFrom",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "users",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "isSet",
                    "type": "bool"
                },
                {
                    "internalType": "enum Utils.ActorType",
                    "name": "actorType",
                    "type": "uint8"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "bytes32",
                    "name": "",
                    "type": "bytes32"
                }
            ],
            "name": "validIds",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "isSet",
                    "type": "bool"
                },
                {
                    "internalType": "uint256",
                    "name": "taskIndex",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "timerType",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "taskIndex",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "withdrawFunds",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "stateMutability": "payable",
            "type": "receive"
        }
    ];

	marketContract = new web3.eth.Contract(
		marketAbi,
		'0xc98Ed98842c7cc68c9460CF31af3e7940138333E'
	);

    console.log("marketplace methods:", marketContract.methods);

	isInitialized = true;
};

export const getCurrentUserBalanceWeb3 = async() => {
    if(!isInitialized){
        await init();
    }
    return marketContract.methods
        .balanceOf(selectedAccount)
        .call();
}

export const getSelectedAccWeb3 = async() => {
    if(!isInitialized){
        await init();
    }
    return selectedAccount;
}

export const getMarketContract = async() =>{
    if(!isInitialized){
        await init();
    }
    return marketContract;
}

export const getUserType = async () =>{
    if(!isInitialized){
        await init();
    }
    
    return marketContract.methods
        .getUserRole()
        .call({
            from: selectedAccount
        },
        (error, result) => {
            console.log("userType", result);
            return parseInt(result);
        }); 
}

export const createNewManager = async (name) => {
    if (!isInitialized){
        await init();
    }

    return marketContract.methods
        .newManager(name)
        .send({
            from: selectedAccount
        },
        (result) => {
            return result;
        })
}

export const createNewFreelancer = async (name, category) => {
    if (!isInitialized){
        await init();
    }

    return marketContract.methods
        .newFreelancer(name, category)
        .send({
            from: selectedAccount
        },
        (result) => {
            return result;
        })
}

export const createNewFinantator = async (name) => {
    if (!isInitialized){
        await init();
    }

    return marketContract.methods
        .newFinantator(name)
        .send({
            from: selectedAccount
        },
        (result) => {
            return result;
        })
}

export const createNewEvaluator = async (name, category) => {
    if (!isInitialized){
        await init();
    }

    return marketContract.methods
        .newEvaluator(name, category)
        .send({
            from: selectedAccount
        },
        (result) => {
            return result;
        })

}

export const getUserDetails = async(actorType) => {
    if(!isInitialized){
        await init();
    }

    switch(actorType){
        case ACTOR_TYPES.MANAGER:
            return marketContract
                .methods
                .getManager(selectedAccount)
                .call().then((result) => {
                    console.log(result);
                    const obj = {
                        name: result.nume
                    }
                    return obj;
                });         
        
        case ACTOR_TYPES.FREELANCER:

            return marketContract
            .methods
            .freelancers(selectedAccount)
            .call().then((result) => {
                console.log(result);
                const obj = {
                    name: result.nume,
                    category: result.category,
                    reputatie: result.reputatie
                }
                return obj;
            }); 
        
        case ACTOR_TYPES.FINANTATOR:
          
            return marketContract
            .methods
            .finantators(selectedAccount)
            .call().then((result) => {
                console.log(result);
                const obj = {
                    name: result.nume
                }
                return obj;
            }); 
              
        case ACTOR_TYPES.EVALUATOR:
        
            return marketContract
            .methods
            .evaluators(selectedAccount)
            .call().then((result) => {
                console.log(result);
                const obj = {
                    name: result.nume,
                    category: result.category,
                    reputatie: result.reputatie
                }
                return obj;
            }); 
        
        default:
            
          return;
      }
    
}

export const createNewTask = async(description, RF, RE, category) =>{
    if(!isInitialized){
        await init();
    }

    return marketContract
        .methods
        .newTask(description, RF, RE, category)
        .send({
            from: selectedAccount
        },
        (err, res) => {
            console.log(res);
            console.log(err);
            return res;
        })
}

export const getTasksArrayLengthWeb3 = async() => {
    if(!isInitialized){
        await init();
    }

    return marketContract
        .methods
        .getTasksArrayLength()
        .call().then((result)=>{
            console.log("Tasks array length", result);
            return result;
        })
}

export const getAllTasksWeb3 = async() => {
    if(!isInitialized){
        await init();
    }

    let tasksLength = await getTasksArrayLengthWeb3();
    let tasks = []
    for(let i = 0; i < tasksLength; i ++){
        let task = await marketContract
        .methods
        .tasks(i)
        .call()
        tasks.push(task);
    }
    console.log("tasks", tasks);
    
    return tasks;
}

export const deleteTaskWeb3 = async(taskIndex) => {
    if(!isInitialized){
        await init();
    }

    return marketContract
        .methods
        .destroyTask(taskIndex)
        .send({
            from: selectedAccount
        },(err, res) => {
            console.log(res);
            console.log(err);
            return res;
        });
}

export const getCreatedEvaluatorsFromEventsWeb3 = async() =>{
    if(!isInitialized){
        await init();
    }

    return marketContract.getPastEvents('newEvaluatorCreated', {
        fromBlock: 0,
        toBlock: 'latest'
    }, function(error, events){ })
    .then(function(evaluatorCreatedEvents){
        const evaluators = [];
        evaluatorCreatedEvents.forEach((evaluatorEvent) => {
        evaluators.push(evaluatorEvent.returnValues);
        })
        console.log("evaluators", evaluators);
        return evaluators;
    });
}

export const getAllEvaluatorsByAddrWeb3 = async(addresses) => {
    if(!isInitialized){
        await init();
    }

    let evaluators = []
    for(let i = 0; i < addresses.length; i ++){
        let evaluator = await marketContract
        .methods
        .evaluators(addresses[i])
        .call()
        evaluators.push(evaluator);
    }
    console.log("evaluators from addr array", evaluators);
    
    return evaluators;
}

export const getAllFreelancersByAddrWeb3 = async(addresses) => {
    if(!isInitialized){
        await init();
    }

    let freelancers = []
    for(let i = 0; i < addresses.length; i ++){
        let freelancer = await marketContract
        .methods
        .freelancers(addresses[i])
        .call()
        freelancers.push(
            {...freelancer, freelancerIndex: i});
    }
    console.log("freelancers from addr array", freelancers);
    
    return freelancers;
}

export function checkEmptyAddr(addr) {
    return /^0x0+$/.test(addr);
}


export const getManagerByAddr = async(addr) => {
    if(!isInitialized){
        await init();
    }
    return marketContract
                .methods
                .getManager(addr)
                .call().then((result) => {
                    console.log("manager by addr", result);
                    return result;
                }); 
}

export const getFreelancerByAddr = async(addr) => {
    if(!isInitialized){
        await init();
    }
    return marketContract
                .methods
                .freelancers(addr)
                .call().then((result) => {
                    console.log("freelancer by addr", result);
                    return result;
                }); 
}

export const getEvaluatorByAddr = async(addr) => {
    if(!isInitialized){
        await init();
    }
    return marketContract
                .methods
                .evaluators(addr)
                .call().then((result) => {
                    console.log("evaluator by addr", result);
                    return result;
                }); 
}

export const getFinantatorByAddr = async(addr) => {
    if(!isInitialized){
        await init();
    }
    return marketContract
                .methods
                .finantators(addr)
                .call().then((result) => {
                    console.log("finantator by addr", result);
                    return result;
                }); 
}

export const getApplyingFreelancersForTaskWeb3 = async(taskIndex) =>{
    if(!isInitialized){
        await init();
    }
    return marketContract
                .methods
                .getAllApplyingFreelancersForTask(taskIndex)
                .call().then((result) =>{
                    console.log(`all applying freelancers for taskIndex ${taskIndex}`, result);
                    return result;
                })
}

export const chooseEvaluatorForTaskWeb3 = async(evAddr, taskIndex) => {
    if(!isInitialized){
        await init();
    }
    return marketContract
            .methods
            .chooseEvaluatorForTask(evAddr, parseInt(taskIndex))
            .send({
                from: selectedAccount
            },
            (err, res) => {
                console.log(res);
                console.log(err);
                return res;
            })
}

export const chooseFreelancerForTaskWeb3 = async(frIndex, taskIndex) => {
    if(!isInitialized){
        await init();
    }
    return marketContract
            .methods
            .chooseFreelancerForTask(parseInt(taskIndex), parseInt(frIndex))
            .send({
                from: selectedAccount
            },
            (err, res) => {
                console.log(res);
                console.log(err);
                return res;
            })
}

export const reviewTaskWeb3 = async(taskIndex, taskDone) => {
    if(!isInitialized){
        await init();
    }
    return marketContract
            .methods
            .reviewTask(taskIndex, taskDone)
            .send({
                from: selectedAccount
            },
            (err, res) => {
                console.log(res);
                console.log(err);
                return res;
            })
}

export const applyForTaskWeb3 = async(taskIndex) => {
    if(!isInitialized){
        await init();
    }
    return marketContract
            .methods
            .applyForTask(taskIndex)
            .send({
                from: selectedAccount 
            },
            (err, res) => {
                console.log(res);
                console.log(err);
                return res;
            })
}

export const getApplyingFreelancersEventForTasksWeb3 = async() =>{
    if(!isInitialized){
        await init();
    }

    return marketContract.getPastEvents('ApplyingFreelancers', {
        fromBlock: 0,
        toBlock: 'latest'
    }, function(error, events){ })
    .then(function(freelancersApplyEvents){
        const freelancers = [];
        freelancersApplyEvents.forEach((freelancerEvent) => {
        freelancers.push(freelancerEvent.returnValues);
        })
        console.log("freelancers event", freelancers);
        return freelancers;
    });
}

export const nominateTaskReadyWeb3 = async(taskIndex) => {
    if(!isInitialized){
        await init();
    }
    return marketContract
            .methods
            .nominateTaskReady(taskIndex)
            .send({
                from: selectedAccount
            },
            (err, res) => {
                console.log(res);
                console.log(err);
                return res;
            })
}

export const financeTaskWeb3 = async(taskIndex, value) => {
    if(!isInitialized){
        await init();
    }
    return marketContract
            .methods
            .financeTask(taskIndex, value)
            .send({
                from: selectedAccount
            },
            (err, res) => {
                console.log(res);
                console.log(err);
                return res;
            })
}

export const getFinantatorsFundingEvidenceForTaskWeb3 = async(taskIndex) => {
    if(!isInitialized){
        await init();
    }
    return marketContract
            .methods
            .getFinantatorsFundingEvLength(taskIndex)
            .call().then(async (length)=>{
                let ledger =[];
                for(let i=0; i< length; i++){
                    
                    let finantator = await marketContract
                            .methods
                            .finantatorsFundingEvidence(taskIndex, i)
                            .call()
                    ledger.push(finantator);
                }
                console.log("finantators ledger", ledger);
                return ledger;
            })
}

export const withdrawFundsWeb3 = async(taskIndex, amount) => {
    if(!isInitialized){
        await init();
    }

    return marketContract
            .methods
            .withdrawFunds(taskIndex, amount)
            .send({
                from: selectedAccount,
            }, (err, res) => {
                console.log(res);
                console.log(err);
                return res;
            });
}

export const evaluateTaskWeb3 = async(taskIndex, taskDone) => {
    if(!isInitialized){
        await init();
    }
    return marketContract
            .methods
            .evaluateTask(taskIndex, taskDone)
            .send({
                from: selectedAccount
            },
            (err, res) => {
                console.log(res);
                console.log(err);
                return res;
            })
}

export const exchangeWeiForTokensWeb3 = async(value)=>{
    if(!isInitialized){
        await init();
    }

    return marketContract
            .methods
            .exchange()
            .send({
                from: selectedAccount,
                value: web3.utils.toWei(value, "wei")
            })
}




