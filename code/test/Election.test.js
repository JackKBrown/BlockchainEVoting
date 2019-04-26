const Election = artifacts.require('./Election.sol')

contract('Election', (accounts) => {
  before(async () => {
    this.election = await Election.deployed()
  })

  it('deploys successfully', async () => {
    const address = await this.election.address
    assert.notEqual(address, 0x0)
    assert.notEqual(address, '')
    assert.notEqual(address, null)
    assert.notEqual(address, undefined)
  })
  
  it('adds candidates', async () => {
	const result = await this.election.addCandidate('John Smith')
	const candidate = await this.election.candidates(1)
	assert.equal(candidate, 'John Smith') 
  })
   
})
