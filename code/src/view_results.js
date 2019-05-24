/* A collection of functions written using truffle and JQuery to add the 
 * smart contract functionality for the view_results.html page requires 
 * setup_web.js to function
 */
Results = {
  loading: false,
  
  /* load an election using setup_web.js then render the smart contract content
   */
  loadElection: async () => {
    Results.setLoading(true)
    await Setup.loadElection()
    Results.setLoading(false)
    await Results.render()
  },
  
  /* prepares the page to load content
   */
  render: async () => {
    // Prevent double render
    if (Results.loading) {
      return
    }

    // Update app loading state
    Results.setLoading(true)

    // Render Account
    $('#account').html(Setup.account)

    // Render Tasks
    await Results.renderResults()

    // Update loading state
    Results.setLoading(false)
  },
  
  /* call the count function then display the candidate votes next to candidate
   */
  renderResults: async () => {
    const candCount = await Setup.election.candCount()
    const $rowTemplate = $('.rowTemplate')
    const votes = await Setup.election.count()
    console.log(votes)
    console.log(votes[1])
    
    for (var i = 0; i < candCount; i++){
      const cand = await Setup.election.candidates(i)
      const $newRowTemplate = $rowTemplate.clone()
      console.log($newRowTemplate)
      $newRowTemplate.find('.candName').html(cand)
      $newRowTemplate.find('.candVotes').html(votes[i].toNumber())
      $('#resultsTable').find('tbody').append($newRowTemplate)
      $newRowTemplate.show()
    }
  },
  
  /* controls the hidden HTML
   */
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

