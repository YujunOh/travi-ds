import { Accordion, Badge, Box, Button, Card, CopyButton, Group, Progress, Radio, Stack, Text, Textarea, Title } from '@mantine/core';
import { useState } from 'react';
import { DECISIONS, optionOf, resultText, type Decision } from './decisions';
import { useMeeting } from './meetingStore';

/* 회의에서 하나씩 고르고 넘어가는 판. 고르면 테마가 바로 바뀌고 고른 값은 주소와 브라우저에 남는다 */

const RESULT = 'result';

/* 넓은 화면에서는 판이 왼쪽에 붙어 있으므로 바뀌는 구역을 오른쪽에서 바로 보여 준다 */
function showSection(id: string) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.getElementById(id)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
}
const isWide = () => window.matchMedia('(min-width: 62em)').matches;

function DecisionItem({ decision, index, onNext }: { decision: Decision; index: number; onNext: () => void }) {
  const value = useMeeting((state) => state.choice[decision.id]);
  const pick = useMeeting((state) => state.pick);
  const clear = useMeeting((state) => state.clear);
  const picked = optionOf(decision, value);
  const shown = optionOf(decision, decision.shownByDefault);

  return (
    <Accordion.Item value={decision.id}>
      <Accordion.Control>
        <Group gap="xs" justify="space-between" wrap="nowrap">
          <Text fw={600} size="sm">
            {index + 1}. {decision.name}
          </Text>
          {picked ? (
            <Badge variant="light" color="green" style={{ flex: 'none' }}>
              {picked.name}
            </Badge>
          ) : (
            <Badge variant="default" style={{ flex: 'none' }}>
              안 고름
            </Badge>
          )}
        </Group>
      </Accordion.Control>
      <Accordion.Panel>
        <Radio.Group
          label={decision.ask}
          description={picked ? undefined : `아직 고르지 않았습니다. 지금 화면은 임시 기본값(${shown?.name})으로 보입니다.`}
          value={value ?? ''}
          onChange={(next) => {
            pick(decision.id, next);
            if (isWide()) showSection(decision.target);
          }}
        >
          <Stack gap="sm" mt="sm">
            {decision.options.map((option) => (
              <Radio key={option.value} value={option.value} label={option.name} description={option.line} />
            ))}
          </Stack>
        </Radio.Group>
        <Group gap="xs" mt="md">
          <Button size="xs" onClick={onNext}>
            {picked ? '다음' : '나중에 고르고 다음'}
          </Button>
          <Button size="xs" variant="default" onClick={() => showSection(decision.target)}>
            바뀌는 곳 보기 ({decision.targetName})
          </Button>
          {picked ? (
            <Button size="xs" variant="subtle" onClick={() => clear(decision.id)}>
              선택 지우기
            </Button>
          ) : null}
        </Group>
      </Accordion.Panel>
    </Accordion.Item>
  );
}

export function MeetingPanel() {
  const choice = useMeeting((state) => state.choice);
  const reset = useMeeting((state) => state.reset);
  const [open, setOpen] = useState<string | null>(() => DECISIONS.find((decision) => !choice[decision.id])?.id ?? RESULT);
  const done = DECISIONS.filter((decision) => choice[decision.id]).length;
  const text = resultText(choice);

  const openItem = (id: string | null) => {
    setOpen(id);
    const decision = DECISIONS.find((item) => item.id === id);
    if (decision && isWide()) showSection(decision.target);
  };

  return (
    <Card id="meeting" padding="md">
      <Title order={2} fz="lg" ff="text">
        지금 할 일
      </Title>
      <Text size="sm" c="dimmed" mt={4}>
        아래 아홉 가지를 하나씩 고릅니다. 고르면 화면이 바로 바뀝니다. 고른 값은 이 브라우저와 주소에 남아서 새로고침해도 그대로입니다.
      </Text>
      <Group gap="sm" mt="sm" wrap="nowrap">
        <Progress value={(done / DECISIONS.length) * 100} color="green" style={{ flex: 1 }} aria-label="고른 개수" />
        <Text size="sm" fw={600} style={{ flex: 'none' }}>
          {DECISIONS.length}개 가운데 {done}개 고름
        </Text>
      </Group>

      <Accordion value={open} onChange={openItem} mt="sm" chevronPosition="left" styles={{ content: { paddingTop: 4 } }}>
        {DECISIONS.map((decision, index) => (
          <DecisionItem key={decision.id} decision={decision} index={index} onNext={() => openItem(DECISIONS[index + 1]?.id ?? RESULT)} />
        ))}
        <Accordion.Item value={RESULT}>
          <Accordion.Control>
            <Text fw={600} size="sm">
              결과 모아 보기
            </Text>
          </Accordion.Control>
          <Accordion.Panel>
            <Textarea aria-label="회의 결과" value={text} readOnly autosize minRows={DECISIONS.length + 1} />
            <Group gap="xs" mt="sm">
              <CopyButton value={text}>
                {({ copied, copy }) => (
                  <Button size="xs" onClick={copy}>
                    {copied ? '복사했습니다' : '결과 복사'}
                  </Button>
                )}
              </CopyButton>
              <CopyButton value={window.location.href}>
                {({ copied, copy }) => (
                  <Button size="xs" variant="default" onClick={copy}>
                    {copied ? '복사했습니다' : '이 상태의 주소 복사'}
                  </Button>
                )}
              </CopyButton>
              <Button
                size="xs"
                variant="subtle"
                color="red"
                onClick={() => {
                  reset();
                  setOpen(DECISIONS[0].id);
                }}
              >
                처음부터 다시
              </Button>
            </Group>
            <Box mt="sm">
              <Text size="xs" c="dimmed">
                1번부터 5번, 7번, 8번은 회의용 페이지 design-system.html 과 같은 이름을 씁니다. 거기서 복사한 주소의 # 뒤 부분을 이 페이지 주소 뒤에 붙이면 같은 선택으로 열립니다.
              </Text>
            </Box>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Card>
  );
}
