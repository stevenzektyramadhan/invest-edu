export type AlarmCondition = "BELOW" | "ABOVE";

export interface PriceAlarm {
  id: string;
  assetId: string;
  symbol: string;
  assetName: string;
  condition: AlarmCondition;
  targetPrice: number;
  unitPrefix: string;
  unitSuffix: string;
  note: string;
  triggered: boolean;
  triggeredAt?: string;
  createdAt: string;
}

export function formatTargetValue(
  val: number,
  unitPrefix: string,
  unitSuffix: string
): string {
  const decimals = val < 100 ? 2 : 0;
  const formatted = new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(val);
  return `${unitPrefix}${formatted}${unitSuffix}`;
}

export function evaluateAlarms(
  alarms: PriceAlarm[],
  currentPrices: Record<string, number>
): { updated: PriceAlarm[]; newlyTriggered: PriceAlarm[] } {
  const newlyTriggered: PriceAlarm[] = [];
  const updated = alarms.map((alarm) => {
    const current = currentPrices[alarm.assetId];
    if (current === undefined || alarm.triggered) return alarm;

    const hit =
      (alarm.condition === "BELOW" && current <= alarm.targetPrice) ||
      (alarm.condition === "ABOVE" && current >= alarm.targetPrice);

    if (hit) {
      const triggeredAlarm: PriceAlarm = {
        ...alarm,
        triggered: true,
        triggeredAt: new Date().toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      };
      newlyTriggered.push(triggeredAlarm);
      return triggeredAlarm;
    }
    return alarm;
  });

  return { updated, newlyTriggered };
}
