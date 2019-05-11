Vote = {
  loading: false,
  
  loadElection: async() => {
    Vote.setLoading(true)
    await Setup.loadElection();
    Vote.setLoading(false)
    await Vote.render()
  },
  
  vote: async () => {
    const token = $('#token').val()
    console.log(token)
    const candID = $( ".input:checked" ).val()
    console.log(candID)
    await Setup.election.castBallot(candID, token)
  },

  render: async () => {
    // Prevent double render
    if (Vote.loading) {
      return
    }
    // Update app loading state
    Vote.setLoading(true)
    // Render Account
    $('#account').html(Setup.account)
    // Render Tasks
    await Vote.renderCands()
    // Update loading state
    Vote.setLoading(false)
  },

  renderCands: async () => {
    const candCount = await Setup.election.candCount()
    const $candTemplate = $('.candTemplate')
    
    for (var i = 0; i < candCount; i++){

      const cand = await Setup.election.candidates(i)
      
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
