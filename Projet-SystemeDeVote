pragma solidity ^0.8.20;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";

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


    function nextWorkflowStatus() public onlyOwner {
        uint8 nextState = uint8(stateWorkflowStatus) + 1;
        stateWorkflowStatus = WorkflowStatus(nextState);
    }


    function RegisteringVoters(address _address)  public  onlyOwner{
        whitelist[_address] = Voter(true, false, 0);
    }

    function ProposalsRegistrationStarted(string memory _proposal) public isWhiteList {
        require(stateWorkflowStatus == WorkflowStatus.ProposalsRegistrationStarted, "Session is not active !");
        proposalArray.push(Proposal(_proposal, 0));
    }

    function seeProposal() public view isWhiteList returns(Proposal[] memory) {
        return proposalArray;
    }

    function VotingSessionStarted(uint _idProposal) public isWhiteList {
        require(stateWorkflowStatus == WorkflowStatus.VotingSessionStarted, "Session is not active !");
        require(whitelist[msg.sender].hasVoted == false, "You can't vote 2 times !");
        
        proposalArray[_idProposal].voteCount += 1;
        whitelist[msg.sender].hasVoted = true;
        whitelist[msg.sender].votedProposalId = _idProposal;
    }


    function getWinner() public view returns(uint) {
        uint winner;
        for (uint compteur=0; compteur < proposalArray.length ; compteur ++) {
            if (proposalArray[compteur].voteCount >= proposalArray[winner].voteCount) {
                winner = compteur;
            }
        }
        return winner;
    }


}
