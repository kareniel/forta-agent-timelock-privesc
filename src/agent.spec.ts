import {
  HandleTransaction,
  createTransactionEvent,
} from 'forta-agent';
import agent from './agent';
import {
  PrivEscCritical,
  PrivEscHigh,
  PrivEscMedium,
  PrivEscLow,
} from './findings';

describe('Timelock privilege escalation detection', () => {
  let handleTransaction: HandleTransaction;

  beforeAll(() => {
    handleTransaction = agent.handleTransaction;
  });

  describe('handleTransaction', () => {
    it('returns empty findings if x', async () => {
      const txEvent = createTransactionEvent({
        transaction: {} as any,
        receipt: {} as any,
        block: {} as any,
      });

      const findings = await handleTransaction(txEvent);

      expect(findings).toStrictEqual([]);
    });

    it('returns a critical severity finding if y1', async () => {
      const txEvent = createTransactionEvent({
        transaction: {} as any,
        receipt: {} as any,
        block: {} as any,
      });

      const findings = await handleTransaction(txEvent);

      expect(findings).toStrictEqual([PrivEscCritical]);
    });

    it('returns a high severity finding if y2', async () => {
      const txEvent = createTransactionEvent({
        transaction: {} as any,
        receipt: {} as any,
        block: {} as any,
      });

      const findings = await handleTransaction(txEvent);

      expect(findings).toStrictEqual([PrivEscHigh]);
    });

    it('returns a medium severity finding if y3', async () => {
      const txEvent = createTransactionEvent({
        transaction: {} as any,
        receipt: {} as any,
        block: {} as any,
      });

      const findings = await handleTransaction(txEvent);

      expect(findings).toStrictEqual([PrivEscMedium]);
    });

    it('returns a low severity finding if y4', async () => {
      const txEvent = createTransactionEvent({
        transaction: {} as any,
        receipt: {} as any,
        block: {} as any,
      });

      const findings = await handleTransaction(txEvent);

      expect(findings).toStrictEqual([PrivEscLow]);
    });
  });
});
