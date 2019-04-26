pragma solidity ^0.5.0;

contract Election {
  uint public candCount = 0;
  address public authority;
  
  struct Ballot {
    //change to signed token
    address voter;
    uint vote;
    bool cast;
  }
  
  //mapping will eventually be signed token to Ballot
  mapping(address => Ballot) public votes;
  address[] public voters;
  string[] public candidates;

  constructor() public {
    authority = msg.sender;
    //adds the first option
    addCandidate("Spoil Ballot");
  }
  
  //function allows the authority to add candidates to be voted on
  function addCandidate(string memory _cand) public {
    require(msg.sender == authority);
    candidates.push(_cand);
    candCount ++;
  }

  function castBallot(uint _cand) public {
    //later need to change it so the token required in not in mapping
    //also need to require that the signed token is legitimate
    require(
      (!votes[msg.sender].cast)&&
      (_cand<candidates.length)
    );
    votes[msg.sender] = Ballot(msg.sender, _cand, true);
    voters.push(msg.sender);
    //potentially emit a voted event?
  }
  
  function count() public view returns (uint[] memory){
    uint[] memory tally = new uint[](candidates.length);
    for (uint j=0; j<voters.length; j++) {
      tally[votes[voters[j]].vote]++;
    }
    return tally;
  }
}
