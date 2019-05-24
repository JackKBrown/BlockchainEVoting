pragma solidity ^0.5.0;

import "./BigNumber.sol";

pragma solidity ^0.5.0;

contract Election {
    
  using BigNumber for *;
  uint public candCount = 0;
  address public authority;
  
  uint public startTime;
  uint public endTime;
  //for RSA this will always be the public key, see fermat's 4th number
  bytes public_key = hex"010001";
  //this can be changed depending on if more than one key pair needs to be used
  bytes N = hex"00b3e2f87b4c11add36801eaf8f2688648607c1725b947b29c5f0421bf018e8eabcb4588d7cbe1f3952220e78ba4ea079cea88d37d7fd4eadad7a5e4a6cf488fa0ace570da142e8735cd3a4a1234135173171d3fc66add3d369c58d1e13a00ae24293054e68cecf24d7b9365e5d694f7bd83b25f6814af7a0a95bd49a8ee34462c001e0e3cf3b205f101a0d81be8e5c998ef17c79b71b7c4f9c382551a72ba3208621fef09d0261a3869a33386d00b5e52c74db18c021e8497adb2b667fd035d6d99d2312bbce5c818a3bc6f24aca2a04bd602014ca70bf98bd0af204ebca8f90b613d446a49d682a219dd670039a84351fa6397b2cad30be18b15473dd24e2ca1";
  
  struct Ballot {
    //change to signed token
    address voter;
    uint vote;
    bool cast;
    bytes token;
  }
  
  
  mapping(address => Ballot) public votes;
  address[] public voters;
  string[] public candidates;
  
  /** @dev Create a new Election instance.
      *
      * parameter: uint _start - starting time seconds since epoch
      * parameter: uint _end - ending time seconds since epoch
      */
  constructor(uint _start, uint _end) public {
    startTime = _start;
    endTime = _end;
    authority = msg.sender;
    //adds the first option
    addCandidate("Spoil Ballot");
  }
  
  /** @dev adds a candidate to the candidate array.
      *
      * parameter: string _cand - candidates name
      */
  function addCandidate(string memory _cand) public {
    require(
      (msg.sender == authority)&&
      (block.timestamp < startTime)
    );
    candidates.push(_cand);
    candCount ++;
  }

  /** @dev adds a ballot to the ballot mapping.
      *
      * parameter: uint _cand - candidates number
      * parameter: bytes token - rsa signed token
      */
  function castBallot(uint _cand, bytes memory token) public {
    require(
      (!votes[msg.sender].cast)&&
      (_cand<candidates.length)&&
      (block.timestamp > startTime)&&
      (block.timestamp < endTime)&&
      (verify_token(msg.sender, token))
    );
    votes[msg.sender] = Ballot(msg.sender, _cand, true, token);
    voters.push(msg.sender);
  }
  
  /** @dev counts the total votes for each candidate
      *
      * returns: array of total votes where the index is the candidate number
      */
  function count() public view returns (uint[] memory){
    uint[] memory tally = new uint[](candidates.length);
    for (uint j=0; j<voters.length; j++) {
      tally[votes[voters[j]].vote]++;
    }
    return tally;
  }
  
  /** @dev verify the content of a rsa token
      *
      * parameter: address sender - message sender
      * parameter: bytes token - rsa signed token
      * returns: boolean as to whether the token verifies or not
      */
  function verify_token(address sender, bytes memory token) public returns(bool){
    uint256 expected = uint256(sender);
    BigNumber.instance memory base = BigNumber.instance(token, false, 2048);
    BigNumber.instance memory exp = BigNumber.instance(public_key, false, 2048);
    BigNumber.instance memory mod = BigNumber.instance(N, false, 2048);
    BigNumber.instance memory res = base.prepare_modexp(exp,mod);
    uint256 given = uint256(bytesToBytes32(res.val));
    return (expected==given);
  }
  
  
    /** @dev truncates bytes to only the last 32 nybbles so it can be converted to bytes32
      *
      * parameter: bytes token - rsa signed token
      * returns: bytes32 the last 32 bytes of the input
      */
  function bytesToBytes32(bytes memory source)internal returns (bytes32 result) {
    uint256 length = source.length;
    if (source.length == 0) {
        return 0x0;
    }
    assembly {
        result := mload(add(source,length))
    }
  }
  
}
