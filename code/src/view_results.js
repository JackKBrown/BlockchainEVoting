Results = {
  loading: false,
  contracts: {},

  load: async () => {
    console.log("loading app")
    await Results.loadWeb3()
    await Results.loadAccount()
  },

  // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
  loadWeb3: async () => {
    if (typeof web3 !== 'undefined') {
      Results.web3Provider = web3.currentProvider
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
      Results.web3Provider = web3.currentProvider
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
    Results.account = web3.eth.accounts[0]
  },
  
  loadElection: async () => {
    Results.setLoading(true)
    const memLoc = $('#oldMemLoc').val()
    //window.location.reload()
    
    // Create a JavaScript version of the smart contract
    const election = await $.getJSON('Election.json')
    Results.contracts.Election = TruffleContract(election)
    Results.contracts.Election.setProvider(Results.web3Provider)

    // Hydrate the smart contract with values from the blockchain
    // e.g 0x9A1684cc48658f098182f154Dfb386080d7B5c6A
    Results.election = await Results.contracts.Election.at(memLoc);
    console.log(Results.election.address)
    Results.setLoading(false)
    await Results.render()
  },

  render: async () => {
    // Prevent double render
    if (Results.loading) {
      return
    }

    // Update app loading state
    Results.setLoading(true)

    // Render Account
    $('#account').html(Results.account)

    // Render Tasks
    await Results.renderResults()

    // Update loading state
    Results.setLoading(false)
  },

  renderResults: async () => {
    const candCount = await Results.election.candCount()
    const $rowTemplate = $('.rowTemplate')
    const votes = await Results.election.count()
    console.log(votes)
    console.log(votes[1])
    
    for (var i = 0; i < candCount; i++){
      const cand = await Results.election.candidates(i)
      const $newRowTemplate = $rowTemplate.clone()
      console.log($newRowTemplate)
      $newRowTemplate.find('.candName').html(cand)
      $newRowTemplate.find('.candVotes').html(votes[i].toNumber())
      $('#resultsTable').find('tbody').append($newRowTemplate)
      $newRowTemplate.show()
    }
  },

  setLoading: (boolean) => {
    Results.loading = boolean
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
    Results.load()
  })
})

