/* A collection of functions written using truffle and JQuery to add the 
 * smart contract functionality for the vote.html page requires 
 * setup_web.js to function
 */
Vote = {
  loading: false,
  
  /* load an election using setup_web.js then render the smart contract content
   */
  loadElection: async() => {
    Vote.setLoading(true)
    await Setup.loadElection();
    Vote.setLoading(false)
    await Vote.render()
  },
  
  /* retrieves the ballot information from HTML using JQuery then constructs
   * a new ballot from that data.
   */
  vote: async () => {
    const token = $('#token').val()
    console.log(token)
    const candID = $( ".input:checked" ).val()
    console.log(candID)
    await Setup.election.castBallot(candID, token)
  },

  /* prepares the page to load content
   */
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

  /* create the list of candidates to vote for
   */
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

  /* controls the hidden HTML
   */
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
