import { Box } from '@mantine/core';
import classes from './chips.module.css';
import { DOMAIN_LABEL, type CoopDomain } from './coopTerms';

/* Coop 이 속한 분야를 알리는 칩. 아이콘 없이 색 점과 이름만 둔다 */
export function DomainChip({ domain }: { domain: CoopDomain }) {
  return (
    <Box component="span" className={`${classes.chip} ${classes.domain} ${classes[domain]}`}>
      {DOMAIN_LABEL[domain]}
    </Box>
  );
}
