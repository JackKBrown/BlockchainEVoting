var election = artifacts.require("./Election.sol");

module.exports = function(deployer) {
  var date = new Date()
  var timestamp = Math.floor(date.getTime()/1000);
	const start = timestamp+5;
	const end = timestamp+20;
	deployer.deploy(election, start, end);
};
