import { Box } from '@mantine/core';
import classes from './chips.module.css';
import { STATUS_LABEL, type CoopStatus } from './coopTerms';

type StatusChipProps = {
  status: CoopStatus;
  /* 이름 뒤에 가운뎃점으로 붙는 짧은 덧말. 예: 12 days left */
  note?: string;
};

/* Coop 의 상태를 알리는 칩. 이름은 coopTerms.ts 의 다섯 개만 쓴다 */
export function StatusChip({ status, note }: StatusChipProps) {
  return (
    <Box component="span" className={`${classes.chip} ${classes[status]}`}>
      {STATUS_LABEL[status]}
      {note ? ` · ${note}` : ''}
    </Box>
  );
}
