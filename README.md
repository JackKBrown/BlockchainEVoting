BlockchainEVoting
=================
This application is a demonstration of a Blockchain E-Voting algorithm inspired by the paper E-Voting with Blockchain by Hardwick et al. [1]

It is still under development and not fully functional though feel free to look at the code for ideas and inspiration.

Installation instructions and requirements
==========================================
This application requires Node.js and the node package manager to work as well as the Truffle framework https://truffleframework.com/, Ganache TestRPC, and a web3 provider like metamask https://metamask.io/.

This application also uses the Stanford Javascript Crypto Library https://github.com/bitwiseshiftleft/sjcl which is included in the src folder.

After you have these requirements installed, you need to install all the necessary dependencies through npm. Run the following command from the directory containing the _package.json_ file:

	npm install

Running instructions
====================
First you must start and deploy the contract to the TestRPC, After starting Ganache run:

	truffle migrate --reset

Just run the following command from the console in order to start the application:

	node run dev

References
=========================
[1] Hardwick, Freya Sheer and Akram, Raja Naeem and Markantonakis, Konstantinos. "E-Voting with Blockchain: An E-Voting Protocol with Decentralisation and Voter Privacy" arXiv preprint arXiv:1805.10258, 2018.
