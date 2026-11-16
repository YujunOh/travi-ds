import { Button, Card, Group, Progress, Stack, Text, Title } from '@mantine/core';
import classes from './coopCard.module.css';
import type { CoopDomain, CoopStatus } from './coopTerms';
import { DomainChip } from './DomainChip';
import { StatusChip } from './StatusChip';

/* Coop 한 개를 목록에서 보여 주는 카드. Mantine 의 Card, Button, Progress 를 그대로 쓰고 칩 두 개만 우리 부품이다.
   배치(무엇을 어느 줄에 둘지)는 아직 후보다 */
export type CoopCardProps = {
  name: string;
  domain: CoopDomain;
  status: CoopStatus;
  /* 상태 칩 뒤에 붙는 덧말. 예: 12 days left */
  statusNote?: string;
  /* 한 줄 소개 */
  line?: string;
  /* 아래쪽 작은 글자들. 예: 12 of 20 members */
  facts?: string[];
  /* 학습 중일 때만 넣는다 */
  round?: { current: number; total: number };
  actionLabel?: string;
  onAction?: () => void;
};

export function CoopCard({ name, domain, status, statusNote, line, facts = [], round, actionLabel = 'View Coop', onAction }: CoopCardProps) {
  return (
    <Card className={classes.lift}>
      <Stack gap="var(--tv-gap)" h="100%">
        <Group gap="xs">
          <StatusChip status={status} note={statusNote} />
          <DomainChip domain={domain} />
        </Group>
        {/* 카드 제목은 큰 제목이 아니라서 글꼴 후보 B 에서도 본문 글꼴을 쓴다 */}
        <Title order={3} fz="lg" lh={1.3} ff="text">
          {name}
        </Title>
        {line ? (
          <Text size="sm" c="dimmed">
            {line}
          </Text>
        ) : null}
        {round ? (
          <Stack gap={6}>
            <Text size="sm" fw={600} className={classes.data}>
              Round {round.current} of {round.total}
            </Text>
            <Progress value={(round.current / round.total) * 100} color="green" aria-label={`Round ${round.current} of ${round.total}`} />
          </Stack>
        ) : null}
        {facts.length > 0 ? (
          <Text size="sm" c="dimmed" className={classes.data}>
            {facts.join(' · ')}
          </Text>
        ) : null}
        <Group mt="auto" pt="xs">
          <Button variant="default" onClick={onAction}>
            {actionLabel}
          </Button>
        </Group>
      </Stack>
    </Card>
  );
}
