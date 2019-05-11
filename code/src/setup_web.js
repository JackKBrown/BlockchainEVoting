Setup = {
  contracts: {},

  load: async () => {
    console.log("loading app")
    await Setup.loadWeb3()
    await Setup.loadAccount()
  },

  // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
  loadWeb3: async () => {
    if (typeof web3 !== 'undefined') {
      Setup.web3Provider = web3.currentProvider
      web3 = new Web3(web3.currentProvider)
    } else {
      window.alert("Please connect to Metamask.")
    }
    // Modern dapp browsers...
    if (window.ethereum) {
      window.web3 = new Web3(ethereum)
      try {
        // Request account access if needed
        await ethereum.enable()
        // Acccounts now exposed
        web3.eth.sendTransaction({/* ... */})
      } catch (error) {
        // User denied account access...
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      Setup.web3Provider = web3.currentProvider
      window.web3 = new Web3(web3.currentProvider)
      // Acccounts always exposed
      web3.eth.sendTransaction({/* ... */})
    }
    // Non-dapp browsers...
    else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  },
  
  //TODO need to make sure this is setup to connect to the correct accounts
  loadAccount: async () => {
    // Set the current blockchain account
    Setup.account = web3.eth.accounts[0]
  },

  createElection: async () => {
    const date_start = (new Date($('#date_start').val())).getTime()
    const date_end = (new Date($('#date_end').val())).getTime()
    // validation on these datetimes
    
    // Create a JavaScript version of the smart contract
    const election = await $.getJSON('Election.json')
    Setup.contracts.Election = TruffleContract(election)
    Setup.contracts.Election.setProvider(Setup.web3Provider)

    // Hydrate the smart contract with values from the blockchain
    // e.g 0x9A1684cc48658f098182f154Dfb386080d7B5c6A
    Setup.election = await Setup.contracts.Election.new(date_start, date_end);
    console.log(Setup.election.address)
  },

  loadElection: async () => {
    const memLoc = $('#oldMemLoc').val()
    //window.location.reload()
    
    // Create a JavaScript version of the smart contract
    const election = await $.getJSON('Election.json')
    Setup.contracts.Election = TruffleContract(election)
    Setup.contracts.Election.setProvider(Setup.web3Provider)

    // Hydrate the smart contract with values from the blockchain
    // e.g 0x9A1684cc48658f098182f154Dfb386080d7B5c6A
    Setup.election = await Setup.contracts.Election.at(memLoc);
    console.log(Setup.election.address)
  }
}

$(() => {
  $(window).load(() => {
    Setup.load()
  })
})

