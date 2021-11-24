/*
 * Source: TimelockController Vulnerability Post-mortem
 * https://forum.openzeppelin.com/t/timelockcontroller-vulnerability-post-mortem/14958
 */

import { Finding, FindingSeverity, FindingType } from 'forta-agent';

// clean up multiline template strings
const d = (str: string) => str.replace(/\n| +/, ' ');

/*
 * Critical. If the EXECUTOR role is open, then anyone can use this
 * vulnerability to hijack the TimelockController and have control over
 * the project assets.
 */
export const PrivEscCritical = Finding.fromObject({
  alertId: 'TL-PRIVESC-1',
  name: 'EXECUTOR role is open',
  description: d(`Anyone can use this vulnerability to hijack the
    TimelockController and have control over the project assets.`),
  type: FindingType.Info,
  severity: FindingSeverity.Critical,
});

/*
 * High. If there is an untrusted address with EXECUTOR rights, such as an
 * externally owned account with a private key that is not properly
 * secured, anyone with access to that account can hijack the Timelock.
 * For the purpose of this assessment, we consider an EXECUTOR to be
 * untrusted if they don’t have PROPOSER rights as well, since PROPOSERs
 * are typically closely guarded accounts. We then consider a Timelock to
 * be in this tier if there is any EXECUTOR address that doesn’t also have
 * PROPOSER rights.
 */
export const PrivEscHigh = Finding.fromObject({
  alertId: 'TL-PRIVESC-2',
  name: 'Untrusted address with EXECUTOR rights',
  description: d(`Anyone with access to the untrusted account can hijack the
    Timelock.`),
  type: FindingType.Info,
  severity: FindingSeverity.High,
});

/*
 * Medium. Even if all EXECUTOR accounts are trusted, the vulnerability
 * allows a single one of them to escalate to ADMIN privileges and revoke
 * access to the others. As such, we consider all Timelocks with more than
 * one EXECUTOR to be at least in this tier.
 */
export const PrivEscMedium = Finding.fromObject({
  alertId: 'TL-PRIVESC-3',
  name: 'Timelock with more than one EXECUTOR',
  description: d(`A single EXECUTOR can escalate to ADMIN privileges and
    revoke access to the others.`),
  type: FindingType.Info,
  severity: FindingSeverity.Medium,
});

/*
 * Low. Timelocks who have only a single proposer/executor are in the
 * lowest risk tier. The vulnerability here poses no risk to project
 * owners, only to the community members.
 */
export const PrivEscLow = Finding.fromObject({
  alertId: 'TL-PRIVESC-4',
  name: 'Timelock has a single proposer/executor',
  description: d(`The vulnerability poses no risk to project owners,
    only to the community members`),
  type: FindingType.Info,
  severity: FindingSeverity.Low,
});
