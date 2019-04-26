Vote = {
  loading: false,
  contracts: {},

  load: async () => {
    console.log("loading app")
    await Vote.loadWeb3()
    await Vote.loadAccount()
  },

  // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
  loadWeb3: async () => {
    if (typeof web3 !== 'undefined') {
      Vote.web3Provider = web3.currentProvider
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
      Vote.web3Provider = web3.currentProvider
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
    Vote.account = web3.eth.accounts[0]
  },

  loadElection: async () => {
    Vote.setLoading(true)
    const memLoc = $('#oldMemLoc').val()
    //window.location.reload()
    
    // Create a JavaScript version of the smart contract
    const election = await $.getJSON('Election.json')
    Vote.contracts.Election = TruffleContract(election)
    Vote.contracts.Election.setProvider(Vote.web3Provider)

    // Hydrate the smart contract with values from the blockchain
    // e.g 0x9A1684cc48658f098182f154Dfb386080d7B5c6A
    Vote.election = await Vote.contracts.Election.at(memLoc);
    console.log(Vote.election.address)
    Vote.setLoading(false)
    await Vote.render()
  },
  
  vote: async () => {
    console.log
    //function
  },

  render: async () => {
    // Prevent double render
    if (Vote.loading) {
      return
    }

    // Update app loading state
    Vote.setLoading(true)

    // Render Account
    $('#account').html(Vote.account)

    // Render Tasks
    await Vote.renderCands()

    // Update loading state
    Vote.setLoading(false)
  },

  renderCands: async () => {
    const candCount = await Vote.election.candCount()
    const $candTemplate = $('.candTemplate')
    
    for (var i = 0; i < candCount; i++){
      console.log("ping")
      const cand = await Vote.election.candidates(i)
      
      const $newCandTemplate = $candTemplate.clone()
      $newCandTemplate.find('.content').html(cand)
      $newCandTemplate.find('.input').val(i)
      $('#candList').append($newCandTemplate)
      $newCandTemplate.show()
    }
  },

  setLoading: (boolean) => {
    Vote.loading = boolean
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
    Vote.load()
  })
})
