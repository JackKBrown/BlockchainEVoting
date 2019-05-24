/* A collection of functions written using truffle and JQuery to add the 
 * smart contract functionality for the create_election.html page 
 * requires setup_web.js to function
 */
CE = {
  loading: false,

  /* create an election using setup_web.js then render the smart contract content
   */
  createElection: async () => {
    CE.setLoading(true)
    await Setup.createElection();
    CE.setLoading(false)
    await CE.render()
  },
  /* load an election using setup_web.js then render the smart contract content
   */
  loadElection: async() => {
    CE.setLoading(true)
    await Setup.loadElection();
    CE.setLoading(false)
    await CE.render()
  },
  
  /* retrieves the candidate information from HTML using JQuery then constructs
   * a new candidate from that data.
   */
  addCandidate: async () => {
    const content = $('#newCand').val()
    await Setup.election.addCandidate(content)
    const candCount = await Setup.election.candCount()   
    CE.appendCand(candCount.toNumber()-1)
  },
  
  /* prepares the page to load content
   */
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
  
  /* populate and load all pre-existing candidates
   */
  renderElection: async () => {
    const candCount = await Setup.election.candCount()      
    for (var i = 0; i < candCount; i++){
      CE.appendCand(i)
    }
  },
  
  /* adds a new candidate to the candidate list
   */
  appendCand: async (candidateNum) => {   
    const $candTemplate = $('.candTemplate') 
    const cand = await Setup.election.candidates(candidateNum)
    const $newCandTemplate = $candTemplate.clone()  
    $newCandTemplate.find('#item').html(cand)
    $newCandTemplate.attr("class",candidateNum)
    $('#candList').append($newCandTemplate)
    $newCandTemplate.show()
  },

  /* controls the hidden HTML
   */
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
