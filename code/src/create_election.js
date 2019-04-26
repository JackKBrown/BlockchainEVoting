CE = {
  loading: false,
  contracts: {},

  load: async () => {
    console.log("loading app")
    await CE.loadWeb3()
    await CE.loadAccount()
  },

  // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
  loadWeb3: async () => {
    if (typeof web3 !== 'undefined') {
      CE.web3Provider = web3.currentProvider
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
      CE.web3Provider = web3.currentProvider
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
    CE.account = web3.eth.accounts[0]
  },

  createElection: async () => {
    CE.setLoading(true)
    const name = $('#name').val()
    
    // Create a JavaScript version of the smart contract
    const election = await $.getJSON('Election.json')
    CE.contracts.Election = TruffleContract(election)
    CE.contracts.Election.setProvider(CE.web3Provider)

    // Hydrate the smart contract with values from the blockchain
    // e.g 0x9A1684cc48658f098182f154Dfb386080d7B5c6A
    CE.election = await CE.contracts.Election.new();
    console.log(CE.election.address)
    CE.setLoading(false)
    await CE.render()
  },
  
  loadElection: async () => {
    CE.setLoading(true)
    const memLoc = $('#oldMemLoc').val()
    //window.location.reload()
    
    // Create a JavaScript version of the smart contract
    const election = await $.getJSON('Election.json')
    CE.contracts.Election = TruffleContract(election)
    CE.contracts.Election.setProvider(CE.web3Provider)

    // Hydrate the smart contract with values from the blockchain
    // e.g 0x9A1684cc48658f098182f154Dfb386080d7B5c6A
    CE.election = await CE.contracts.Election.at(memLoc);
    console.log(CE.election.address)
    CE.setLoading(false)
    await CE.render()
  },
  
  addCandidate: async () => {
    const content = $('#newCand').val()
    await CE.election.addCandidate(content)
    //window.location.reload()
  },

  render: async () => {
    // Prevent double render
    if (CE.loading) {
      return
    }

    // Update app loading state
    CE.setLoading(true)

    // Render Account
    $('#account').html(CE.account)

    // Render Tasks
    await CE.renderElection()

    // Update loading state
    CE.setLoading(false)
  },

  renderElection: async () => {
    const candCount = await CE.election.candCount()
    const $candTemplate = $('.candTemplate')
    
    for (var i = 0; i < candCount; i++){
      console.log("ping")
      const cand = await CE.election.candidates(i)
      const $newCandTemplate = $candTemplate.clone()
      $newCandTemplate.find('.content').html(cand)
      $('#candList').append($newCandTemplate)
      $newCandTemplate.show()
    }
  },

  setLoading: (boolean) => {
    CE.loading = boolean
    const loader = $('#loader')
    const content = $('#content')
    if (boolean) {
      loader.show()
      content.hide()
    } else {
      loader.hide()
      content.show()
    }
  }
}

$(() => {
  $(window).load(() => {
    CE.load()
  })
})
