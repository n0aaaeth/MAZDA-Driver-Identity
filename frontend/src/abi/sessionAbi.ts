export const sessionKeyAbi = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_sessionKeyId",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_duration",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "_tempPublicKey",
				"type": "address"
			}
		],
		"name": "createSessionKey",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_sessionKeyId",
				"type": "string"
			},
			{
				"components": [
					{
						"internalType": "address",
						"name": "to",
						"type": "address"
					},
					{
						"internalType": "bytes",
						"name": "data",
						"type": "bytes"
					},
					{
						"internalType": "uint256",
						"name": "value",
						"type": "uint256"
					},
					{
						"internalType": "enum ISafe.Operation",
						"name": "operation",
						"type": "uint8"
					}
				],
				"internalType": "struct SessionKeyModule.Tx[]",
				"name": "_txs",
				"type": "tuple[]"
			}
		],
		"name": "executeWithSessionKey",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"components": [
					{
						"internalType": "address",
						"name": "to",
						"type": "address"
					},
					{
						"internalType": "bytes4",
						"name": "selector",
						"type": "bytes4"
					},
					{
						"internalType": "bool",
						"name": "hasValue",
						"type": "bool"
					},
					{
						"internalType": "enum ISafe.Operation",
						"name": "operation",
						"type": "uint8"
					}
				],
				"internalType": "struct SessionKeyModule.TxSpec[]",
				"name": "_txs",
				"type": "tuple[]"
			}
		],
		"name": "removeWhitelistedTransaction",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_trustedForwarder",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "sessionKey",
				"type": "bytes32"
			}
		],
		"name": "SetSessionKey",
		"type": "event"
	},
	{
		"inputs": [
			{
				"components": [
					{
						"internalType": "address",
						"name": "to",
						"type": "address"
					},
					{
						"internalType": "bytes4",
						"name": "selector",
						"type": "bytes4"
					},
					{
						"internalType": "bool",
						"name": "hasValue",
						"type": "bool"
					},
					{
						"internalType": "enum ISafe.Operation",
						"name": "operation",
						"type": "uint8"
					}
				],
				"internalType": "struct SessionKeyModule.TxSpec[]",
				"name": "_txs",
				"type": "tuple[]"
			}
		],
		"name": "whitelistTransaction",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_user",
				"type": "address"
			},
			{
				"components": [
					{
						"internalType": "address",
						"name": "to",
						"type": "address"
					},
					{
						"internalType": "bytes4",
						"name": "selector",
						"type": "bytes4"
					},
					{
						"internalType": "bool",
						"name": "hasValue",
						"type": "bool"
					},
					{
						"internalType": "enum ISafe.Operation",
						"name": "operation",
						"type": "uint8"
					}
				],
				"internalType": "struct SessionKeyModule.TxSpec[]",
				"name": "_specs",
				"type": "tuple[]"
			}
		],
		"name": "encodeTx",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "pure",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "forwarder",
				"type": "address"
			}
		],
		"name": "isTrustedForwarder",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_user",
				"type": "address"
			},
			{
				"components": [
					{
						"internalType": "address",
						"name": "to",
						"type": "address"
					},
					{
						"internalType": "bytes4",
						"name": "selector",
						"type": "bytes4"
					},
					{
						"internalType": "bool",
						"name": "hasValue",
						"type": "bool"
					},
					{
						"internalType": "enum ISafe.Operation",
						"name": "operation",
						"type": "uint8"
					}
				],
				"internalType": "struct SessionKeyModule.TxSpec[]",
				"name": "_specs",
				"type": "tuple[]"
			}
		],
		"name": "isWhitelistedTransaction",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
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
		"name": "sessionKeys",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "end",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "tempPublicKey",
				"type": "address"
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
		"name": "whitelistedTransactions",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]