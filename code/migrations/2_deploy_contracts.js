var election = artifacts.require("./Election.sol");

module.exports = function(deployer) {
	var date = new Date();
	const start = date.getTime();
	const end = start+1;
	deployer.deploy(election, start, end);
};
