// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity ^0.8.20;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";


// remarque : le vote a egalite n'est pas pris en compte
contract Voting is Ownable {

    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint votedProposalId;
    }

    struct Proposal {
        string description;
        uint voteCount;
    }

    event VoterRegistered(address voterAddress); 
    event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus);
    event ProposalRegistered(uint proposalId);
    event Voted (address voter, uint proposalId);

    enum WorkflowStatus {
        RegisteringVoters,
        ProposalsRegistrationStarted,
        ProposalsRegistrationEnded,
        VotingSessionStarted,
        VotingSessionEnded,
        VotesTallied
    }

    mapping (address => Voter) whitelist;
    Proposal[] proposalArray;

    // variable to follow the state of enum
    WorkflowStatus stateWorkflowStatus;

    modifier isWhiteList() {
        require(whitelist[msg.sender].isRegistered == true, "You are not authorized !");
        _;
    }


    function nextWorkflowStatus() public external onlyOwner {
        require(uint8(stateWorkflowStatus) + 1 < 6, "End session !");
        uint8 nextState = uint8(stateWorkflowStatus) + 1;

        emit WorkflowStatusChange(stateWorkflowStatus, WorkflowStatus(nextState));
        stateWorkflowStatus = WorkflowStatus(nextState);
    }


    function RegisteringVoters(address _address) public external onlyOwner {
        require(!whitelist[_address].isRegistered, "User already registered");
        whitelist[address].isregistered=true;
        emit VoterRegistered(_address);
    }

    function ProposalsRegistration(string memory _proposal) public external isWhiteList {
        require(stateWorkflowStatus == WorkflowStatus.ProposalsRegistrationStarted, "Session is not active !");
        proposalArray.push(Proposal(_proposal, 0));

        emit ProposalRegistered(proposalArray.length - 1);
    }

    function seeProposal() public external view isWhiteList returns(Proposal[] memory) {
        return proposalArray;
    }

    function VotingSession(uint _idProposal) public external isWhiteList {
        require(stateWorkflowStatus == WorkflowStatus.VotingSessionStarted, "Session is not active !");
        require(whitelist[msg.sender].hasVoted == false, "You can't vote 2 times !");
        
        proposalArray[_idProposal].voteCount += 1;
        whitelist[msg.sender].hasVoted = true;
        whitelist[msg.sender].votedProposalId = _idProposal;

        emit Voted(msg.sender, _idProposal);
    }


    function getWinner() public external view returns(uint) {
        require(stateWorkflowStatus == WorkflowStatus.VotesTallied, "Voting not yet closed !");
        uint winner;
        for (uint compteur=0; compteur < proposalArray.length; compteur ++) {
            if (proposalArray[compteur].voteCount > proposalArray[winner].voteCount) {
                winner = compteur;
            }
        }

        return winner;
    }

}
