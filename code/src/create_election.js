CE = {
  loading: false,

  createElection: async () => {
    CE.setLoading(true)
    await Setup.createElection();
    CE.setLoading(false)
    await CE.render()
  },
  
  loadElection: async() => {
    CE.setLoading(true)
    await Setup.loadElection();
    CE.setLoading(false)
    await CE.render()
  },
  
  addCandidate: async () => {
    const content = $('#newCand').val()
    await Setup.election.addCandidate(content)
    const candCount = await Setup.election.candCount()   
    CE.appendCand(candCount.toNumber()-1)
  },

  render: async () => {
    // Prevent double render
    if (CE.loading) {
      return
    }

    // Update app loading state
    CE.setLoading(true)

    // Render Account
    $('#account').html(Setup.account)

    $('#elecMem').val(Setup.election.address)
    
    // Render Tasks
    await CE.renderElection()

    // Update loading state
    CE.setLoading(false)
  },

  renderElection: async () => {
    const candCount = await Setup.election.candCount()      
    for (var i = 0; i < candCount; i++){
      CE.appendCand(i)
    }
  },
  
  appendCand: async (candidateNum) => {   
    const $candTemplate = $('.candTemplate') 
    const cand = await Setup.election.candidates(candidateNum)
    const $newCandTemplate = $candTemplate.clone()  
    $newCandTemplate.find('#item').html(cand)
    $newCandTemplate.attr("class",candidateNum)
    $('#candList').append($newCandTemplate)
    $newCandTemplate.show()
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
