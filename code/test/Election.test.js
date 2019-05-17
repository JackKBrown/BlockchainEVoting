const Election = artifacts.require('./Election.sol');

const token1 = '0x8e472a11f64dffbe067d00dcf3dbb8b9dd6b88d35fc607b8d23420bbc2bf8c94821a53afaf858095cde590ab6f17db38e15b3414ee6104e88e4b44e989812e60635128dc4143c6549ed2de6aaa1db6bef661b0b61573403f7368b3ff688f3fbd0ab72841c368eab3a8f98b0b094e0453ce69f8985e81eba56206ce20228e162846838bdaa9bf949a81468c0198997d963e66c0b96bb4f34c17d35373381fff2701b03906e0bbb9ef1011fa10fd4f2c8d0035b56338a939a82e5a005154b35c9dbd7b72876f8639f53214df0b799051eb3dc8b37e6c410f59541ea43a0f927f7bc21abe9ad759fc5909528dcfd108f676d1bd6b8f4953390c5b005a2affe3c0e6';
const token2 = '0x5f534a3614afd8066e914a9cfcf6d6b8aae5436ff753cd713599737dea84ed5864c5efa55f3e636a228adade6b4fd4638a27713805f19a715aef7c39e1d0bad69d2a098488a07c542e681f98f5dc2e012f9a852083e4de8107cbebf6ac718d4bcd465739132eb277273d7f8ab35e764e6b1c38eddda81bff2ac9547c2a01421a0bd41b39d06ee3b7f2eccbb8156ce5a39f8d583876147ca188d5b957b75633d9fc0f628b78f220e037ae952370b1738ca414754c38096c46f66079ada843677dea3f291d1909ef964c99e17a906577c23e85b415360450590ec6cca0af0579046de6edbcc91ec8373c6a9a603e8b069e0d709f71298b7ab9bd78dfba83628244';
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
  
  it("doesn't cast ballots before the start", async () => {
    try{
      await this.election.castBallot(0, token1)
      assert.fail("expected error")
    } catch (error) {
      assert.notEqual(error, undefined, 'Error must be thrown')
      assert.isAbove(error.message.search('VM Exception while processing transaction: revert'), -1, 'Error: VM Exception while processing transaction: revert')  
    }
  })
  
  it("waits 6 seconds", async () => {
    var date = new Date().getTime()
    //force wait
    while (new Date().getTime() < date+6000){
      ;
    }
  })
  
  it("doesn't add candidates after the start", async () => {
    try{
      await this.election.addCandidate('Jane Smith')
      assert.fail("expected error")
    } catch (error) {
      assert.notEqual(error, undefined, 'Error must be thrown')
      assert.isAbove(error.message.search('VM Exception while processing transaction: revert'), -1, 'Error: VM Exception while processing transaction: revert')  
    }
  })
  
  it("casts and counts ballots", async () => {
    const votes = await this.election.count()
    assert.equal(votes[0].toNumber(), 0)
    await this.election.castBallot(0, token1)
    const votes1 = await this.election.count()
    assert.equal(votes1[0].toNumber(), 1)
  })
  
  it("can only use a token once", async () => {
    try{
      await this.election.castBallot(0, token1)
      assert.fail("expected error")
    } catch (error) {
      assert.notEqual(error, undefined, 'Error must be thrown')
      assert.isAbove(error.message.search('VM Exception while processing transaction: revert'), -1, 'Error: VM Exception while processing transaction: revert')  
    }
  })
  
  it("waits 15 seconds", async () => {
    var date = new Date().getTime()
    //force wait
    while (new Date().getTime() < date+15000){
      ;
    }
  })
  
  it("doesn't cast ballots after the end", async () => {
    try{
      await this.election.castBallot(0, token2)
      assert.fail("expected error")
    } catch (error) {
      assert.notEqual(error, undefined, 'Error must be thrown')
      assert.isAbove(error.message.search('VM Exception while processing transaction: revert'), -1, 'Error: VM Exception while processing transaction: revert')  
    }
  })
  
})

