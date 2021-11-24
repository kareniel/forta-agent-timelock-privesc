# Notes

- OZ=OpenZeppelin
- Timelock is part of the OZ Governance system
- TimelockController has to "have root" on the controlled contract
- The TimelockController contract is in charge of *introducing a delay* between a proposal and its execution
- something something [the check-effects-interaction pattern](https://fravoll.github.io/solidity-patterns/checks_effects_interactions.html)
- "The basic way that the exploit can be detected using a Forta agent is based on 
the particular sequence of events (logs) that it emits."
- "This attack has not, as far as we know, been executed on chain."
- Governor is an abstract contract
- It relies on cryptography (ECDSA, draftEIP712, ERC165), math (SafeCast), utils (Address, Context, Timer)
- Governor extends Context, ERC165, EIP712, and the IGovernor interface
- Timelock depends on access (AccessControl) because Timelock extends AccessControl
- 3 roles: Proposer (schedule and cancel operations), Executor (execute once timelock has expired), Admin (grant the other two roles)
- The admin role is typically given to the timelock itself
- On deployment, both the timelock and the deployer have this role
- deployer can renounce the admin role
- The proposer role is typically given to an EOA, a multisig, or a DAO
- Operations lifecycle: Unset → Pending → Pending + Ready → Done

## Detection

1. MinDelayChange(\_, 0) & CallExecuted(id, ...) emitted. Timelock delay was set. Id noted.
1. CallScheduled(id, ...) emitted. Id matches. Proposal was scheduled.
1. CallExecuted() emitted before CallScheduled(). Id matches. Alert!

future:

1. Contract is at risk of being locked
1. Potential privilege escalation situation
  1. Batch proposal created and either:
    1. An executor becomes a proposer or an admin
    1. All but one of the proposers and executors are removed

## Checklist 

Agent implementation
- [] Does the code correctly alert according to the challenge description?
- [] Does the code make appropriate use of Forta SDK and built-in functions?
- [] Does the code contain comments?
- [] Is the code well-formatted and easy to read?

Testing
- [] Do all tests run and pass?
- [] Are there negative test cases? i.e. when alerts should not be created
- [] Are there positive test cases? i.e. when alerts should be created

Documentation
- [] Does the README.md have a concise description of agent functionality?
- [] Does the README.md contain well-formatted descriptions of each alert?
- [] (If Applicable) Does the README.md contain real blocks/transactions that will trigger alerts?
- [] Does the package.json contain an appropriate name and description?

## Challenge: Vulnerability in the TimelockController contract

By exploiting this vulnerability, someone with the executor role could 
escalate privileges and become admin of the timelock.

In the worst scenario, if the executor role was not granted to a set of trusted accounts but left "open" unrestricted, an arbitrary attacker could take full control of the timelock.

As part of *the execution of a batch proposal*, at least the following things need to happen in this order: 

The above rules identify this particular exploit, but as a bonus challenge it would be interesting to 
- alert more generally on a potential privilege escalation situation 
- by monitoring for batch proposals where either:
- an executor becomes a proposer or an admin, or
- all but one of the proposers and executors are removed
- other ideas are welcome.


## Quotes

> When set as the owner of an Ownable smart contract, it enforces a timelock on all onlyOwner maintenance operations

> By default, this contract is self administered

> A common use case is to position this TimelockController as the owner of a smart contract, with a multisig or a DAO as the sole proposer

> Timelock extensions add a delay for governance decisions to be executed. The workflow is extended to require a queue step before execution. With these modules, proposals are executed by the external timelock contract, thus it is the timelock that has to hold the assets that are being governed.

> {GovernorTimelockControl}: Connects with an instance of {TimelockController}. Allows multiple proposers and executors, in addition to the Governor itself.

> {GovernorTimelockCompound}: Connects with an instance of Compound’s Timelock contract.

> In a governance system, the {TimelockController} contract is in charge of introducing a delay between a proposal and its execution. It can be used with or without a {Governor}.

> If the timelock is completely self-governed, make sure when revoking a Proposer or Executor that you have at least one other trusted user assigned to this role. Otherwise, no one will have the correct privileges to create or execute proposals on the TimelockController contract, essentially locking it down.


## Lessons learned

1. Pay special attention to any complex functions that do not strictly follow the check-effects-interaction pattern
2. Review event emissions across the library to ensure we can identify specific smart contracts if necessary
3. Mapping deployed addresses to projects in a way that can be consumed programmatically so appropriate teams can be alerted to issues when they arise
4. Set up and clearly communicate a security email address


## Reference

- https://docs.openzeppelin.com/contracts/4.x/api/governance
- https://forum.openzeppelin.com/t/timelockcontroller-vulnerability-post-mortem/14958
- https://drdr-zz.medium.com/analysis-of-oz-timelockcontroller-security-vulnerability-patch-23da47a3c158
- https://blog.openzeppelin.com/bypassing-smart-contract-timelocks/
- https://compound.finance/docs/governance
