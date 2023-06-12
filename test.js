
const Voting = artifacts.require('./Voting.sol');
const { BN, expectRevert, expectEvent } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');



contract("Voting", accounts => {

    const owner = accounts[0];
    const voter = accounts[1];


    let votingSessionInstance;

    describe("Voting System", () =>  { 

        beforeEach(async function() {
            votingSessionInstance = await Voting.new({ from: owner });
        });

        describe("The owner's functions", () => {

            it("Register a person, get event voter add", async () => {
                let addVoter = await votingSessionInstance.RegisteringVoters(voter);
                expectEvent(addVoter, "VoterRegistered", { voterAddress : voter });

                let infosVoter = await votingSessionInstance.getVoter(voter,{from: voter});
                expect(infosVoter.isRegistered).to.be.true;
            })

            it("Cannot register a person twice", async () => {
                await votingSessionInstance.RegisteringVoters(voter);
                await expectRevert(votingSessionInstance.RegisteringVoters(voter), "User already registered")
            })

            it("Cannot change status of WorkFlow if not Owner", async () => {
                await expectRevert(votingSessionInstance.nextWorkflowStatus({ from : voter }), 'caller is not the owner');
            })

            it("Cannot exceed 5 values of WorkflowStatus enum", async () => {

                await votingSessionInstance.nextWorkflowStatus();
                await votingSessionInstance.nextWorkflowStatus();
                await votingSessionInstance.nextWorkflowStatus();
                await votingSessionInstance.nextWorkflowStatus();
                await votingSessionInstance.nextWorkflowStatus();

                await expectRevert(votingSessionInstance.nextWorkflowStatus(), 'End session !');

            })

        })


        describe("The Voter's functions", () => {


            it("Proposals registration, get event register", async () => {
                await votingSessionInstance.RegisteringVoters(voter);
                await votingSessionInstance.nextWorkflowStatus();

                let proposalRegistration = await votingSessionInstance.ProposalsRegistration('Je vote 2', { from : voter });
                expectEvent(proposalRegistration, "ProposalRegistered", { proposalId : new BN(0) })

                arrayProposal = await votingSessionInstance.seeProposal({from : voter});
                expect(arrayProposal[0].description).to.equal('Je vote 2');
            })

            it("Add Vote to proposal, get event vote", async () => {
                await votingSessionInstance.RegisteringVoters(voter);

                await votingSessionInstance.nextWorkflowStatus();
                await votingSessionInstance.ProposalsRegistration('Je vote 2', { from : voter });
                await votingSessionInstance.nextWorkflowStatus();
                await votingSessionInstance.nextWorkflowStatus();

                let voting = await votingSessionInstance.VotingSession(0, {from : voter});
                expectEvent(voting, "Voted", { voter : voter, proposalId : new BN(0) })

                arrayProposal = await votingSessionInstance.seeProposal({from : voter});
                expect(arrayProposal[0].voteCount).to.be.bignumber.equal(new BN(1));
            })


            it("Cannot vote twice", async () => {
                await votingSessionInstance.RegisteringVoters(voter);

                await votingSessionInstance.nextWorkflowStatus();
                await votingSessionInstance.ProposalsRegistration('Je vote 2', { from : voter });
                await votingSessionInstance.nextWorkflowStatus();
                await votingSessionInstance.nextWorkflowStatus();

                await votingSessionInstance.VotingSession(0, {from : voter});
                await expectRevert(votingSessionInstance.VotingSession(0, {from : voter}), "You can't vote 2 times !")

            });

        })

        describe("Everyone's functions", () => {

            it("Return the Winner", async () => {
                await votingSessionInstance.RegisteringVoters(voter);
                await votingSessionInstance.RegisteringVoters(accounts[2]);
                await votingSessionInstance.RegisteringVoters(accounts[3]);

                await votingSessionInstance.nextWorkflowStatus();

                await votingSessionInstance.ProposalsRegistration('Je vote Honda', { from : voter });
                await votingSessionInstance.ProposalsRegistration('Je vote Suzuki', { from : accounts[2] });
                await votingSessionInstance.ProposalsRegistration('Je vote Yamaha', { from : accounts[3] });

                await votingSessionInstance.nextWorkflowStatus();
                await votingSessionInstance.nextWorkflowStatus();

                await votingSessionInstance.VotingSession(1, {from : voter});
                await votingSessionInstance.VotingSession(1, {from : accounts[2]});
                await votingSessionInstance.VotingSession(0, {from : accounts[3]});

                await votingSessionInstance.nextWorkflowStatus();
                await votingSessionInstance.nextWorkflowStatus();

               
                expect(await votingSessionInstance.getWinner()).to.be.bignumber.equal(new BN(1));
            });
        })

    })
    

})
