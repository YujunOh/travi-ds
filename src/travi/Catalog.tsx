import {
  Affix,
  Badge,
  Box,
  Button,
  Card,
  Checkbox,
  Chip,
  Code,
  Container,
  Divider,
  Group,
  List,
  Pagination,
  Radio,
  SegmentedControl,
  SimpleGrid,
  Stack,
  Stepper,
  Switch,
  Table,
  Tabs,
  Text,
  TextInput,
  Title,
  useComputedColorScheme,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { useWindowScroll } from '@mantine/hooks';
import type { ReactNode } from 'react';
import { COOP_DOMAINS, COOP_STATUSES, CoopCard, DomainChip, StatusChip, type Picked } from '../framework/ui';
import classes from './catalog.module.css';
import { EXAMPLE_COOPS } from './coops';
import { MeetingPanel } from './MeetingPanel';

/* 카탈로그 한 장. 지금까지 정한 것이 Mantine 테마에서 어떻게 보이는지 모아 둔다.
   왼쪽(좁은 화면은 맨 위)이 회의에서 고르는 판이고 오른쪽이 그 결과가 입혀지는 부품들이다.
   화면 속 영어는 확정된 표기만 쓴다. 설명 글은 한국어다 */

type Verdict = 'fixed' | 'defaulted' | 'candidate' | 'partial';

/* 확정은 초록, 후보는 노랑, 확인 전 기본값은 회색으로 채우고, 확정과 후보가 섞인 것만 테두리 모양으로 둔다 */
const VERDICT: Record<Verdict, { label: string; color: string; variant: string }> = {
  fixed: { label: '확정', color: 'green', variant: 'light' },
  defaulted: { label: '기본값, 확인 전', color: 'gray', variant: 'light' },
  candidate: { label: '후보', color: 'amber', variant: 'light' },
  partial: { label: '일부 확정', color: 'indigo', variant: 'outline' },
};

function VerdictBadge({ verdict, text }: { verdict: Verdict; text?: string }) {
  return (
    <Badge variant={VERDICT[verdict].variant} color={VERDICT[verdict].color}>
      {text ?? VERDICT[verdict].label}
    </Badge>
  );
}

/* 설명용 제목은 후보 글꼴을 따르지 않게 본문 글꼴로 고정한다(ff="text"). 후보 글꼴은 '글자' 구역의 견본에서 본다 */
function Section({ id, title, verdict, verdictText, lead, children }: { id: string; title: string; verdict?: Verdict; verdictText?: string; lead: string; children: ReactNode }) {
  return (
    <Box component="section" id={id} py="xl" className={classes.section}>
      <Group gap="sm" mb={6}>
        <Title order={2} fz="h3" ff="text">
          {title}
        </Title>
        {verdict ? <VerdictBadge verdict={verdict} text={verdictText} /> : null}
      </Group>
      <Text c="dimmed" mb="lg" maw={720}>
        {lead}
      </Text>
      {children}
    </Box>
  );
}

/* 부품 하나를 담는 상자 */
function Sample({ name, note, children }: { name: string; note: string; children?: ReactNode }) {
  return (
    <Card>
      <Text fw={600} mb={4}>
        {name}
      </Text>
      <Text size="sm" c="dimmed" mb={children ? 'md' : 0}>
        {note}
      </Text>
      {children}
    </Card>
  );
}

function SchemeSwitch() {
  const { setColorScheme } = useMantineColorScheme();
  const scheme = useComputedColorScheme('light');
  return (
    <SegmentedControl
      aria-label="화면 밝기"
      value={scheme}
      onChange={(value) => setColorScheme(value === 'dark' ? 'dark' : 'light')}
      data={[
        { label: '밝게', value: 'light' },
        { label: '어둡게', value: 'dark' },
      ]}
    />
  );
}

/* 좁은 화면에서 아래로 내려간 뒤 고르는 판으로 돌아가는 단추 */
function BackToMeeting() {
  const [scroll, scrollTo] = useWindowScroll();
  if (scroll.y < 500) return null;
  return (
    <Affix position={{ bottom: 16, right: 16 }} hiddenFrom="md">
      <Button onClick={() => scrollTo({ y: 0 })}>고르는 곳으로</Button>
    </Affix>
  );
}

/* 색 계단 한 줄 */
const SCALES: { key: string; name: string; note: string }[] = [
  { key: 'indigo', name: 'indigo', note: '주색. 6번이 가장 중요한 버튼과 글자 링크' },
  { key: 'gray', name: 'gray', note: '밝은 화면의 바탕, 선, 글자' },
  { key: 'dark', name: 'dark', note: '어두운 화면의 글자, 선, 바탕. 7번이 페이지 바탕' },
  { key: 'green', name: 'green', note: '잘 되고 있음. 6번이 칩 글자' },
  { key: 'amber', name: 'amber', note: '주의. 8번이 칩 글자' },
  { key: 'red', name: 'red', note: '위험과 거절. 6번이 위험 버튼' },
];

function ScaleRow({ scaleKey, name, note }: { scaleKey: string; name: string; note: string }) {
  const theme = useMantineTheme();
  const steps = theme.colors[scaleKey];
  return (
    <Box>
      <Group gap="xs" mb={6} align="baseline">
        <Text fw={600}>{name}</Text>
        <Text size="sm" c="dimmed">
          {note}
        </Text>
      </Group>
      <SimpleGrid cols={{ base: 5, sm: 10 }} spacing={6} verticalSpacing="xs">
        {steps.map((hex, index) => (
          <Box key={index}>
            <Box h={40} bg={hex} style={{ borderRadius: 6, border: '1px solid var(--tv-line)' }} />
            <Text size="xs" c="dimmed" mt={2} lh={1.3}>
              {index}
              <br />
              {hex}
            </Text>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
}

/* 역할: 화면이 실제로 쓰는 이름 */
const ROLES: { name: string; use: string }[] = [
  { name: '--tv-bg', use: '페이지 바탕' },
  { name: '--tv-bg-subtle', use: '한 단 가라앉은 구역, 표 머리' },
  { name: '--tv-surface', use: '카드, 팝업, 입력칸' },
  { name: '--tv-line', use: '카드 테두리, 구분선' },
  { name: '--tv-line-strong', use: '버튼과 입력칸 테두리' },
  { name: '--tv-text', use: '본문 글자' },
  { name: '--tv-text-muted', use: '보조 설명' },
  { name: '--tv-text-faint', use: '가장 흐린 글자. 카드와 페이지 바탕 위에서만' },
  { name: '--tv-primary', use: '가장 중요한 버튼' },
  { name: '--tv-primary-hover', use: '그 버튼에 마우스를 올렸을 때' },
  { name: '--tv-link', use: '글자 링크' },
  { name: '--tv-focus', use: '짚은 곳의 테, 짚은 입력칸의 테두리' },
  { name: '--tv-success', use: '잘 되고 있음' },
  { name: '--tv-warning', use: '주의' },
  { name: '--tv-danger', use: '위험, 거절' },
  { name: '--tv-info', use: '안내, 선택된 것' },
];

function RoleItem({ name, use }: { name: string; use: string }) {
  return (
    <Group gap="sm" wrap="nowrap" align="center">
      <Box w={36} h={36} style={{ flex: 'none', borderRadius: 8, background: `var(${name})`, border: '1px solid var(--tv-line-strong)' }} />
      <Box miw={0}>
        <Text size="sm" fw={600} style={{ overflowWrap: 'anywhere' }}>
          {name}
        </Text>
        <Text size="sm" c="dimmed">
          {use}
        </Text>
      </Box>
    </Group>
  );
}

/* 표지의 세 묶음. 확정은 유준이 직접 답한 것만 적는다(정본 기록 H절 10~12번) */
const FIXED_LIST = [
  '주색은 남색. 밝은 화면은 #3f4ff0 에 흰 글자, 어두운 화면은 #8598fe 에 어두운 글자',
  '표기는 Coop. 첫 글자만 대문자',
  '상태 이름 다섯 개, Log in, Join TRAVI',
  '상단 메뉴 넷의 이름과 순서, 역할 이름 넷',
  '보상은 points, 단위는 pts',
  '예시 Coop 두 개와 데이터 용어 network flow records',
];

const DEFAULTED_LIST = [
  '회색과 상태색(초록, 노랑, 빨강)의 값',
  '분야색 다섯 가지',
  '역할 배정. 어느 칸을 바탕, 선, 글자, 링크, 짚은 곳의 테로 쓸지',
];

const CANDIDATE_LIST = [
  '글꼴, 글자 크기, 모서리, 간격, 버튼, 테두리 진하기, 칩 색, 카드. 이 페이지에서 바꿔 볼 수 있습니다',
  '입력칸 도움말 위치와 헤더 모양. design-system.html 에서 고릅니다',
  '제목 크기 제안(56, 40, 28, 20)',
  'Next 로 갈지 Vite 로 갈지. 이 페이지는 임시로 Vite 입니다',
];

const TERMS: { group: string; term: string; note: string }[] = [
  { group: '조합', term: 'Coop', note: '첫 글자만 대문자입니다. Co-op 이나 COOP 으로 쓰지 않습니다(11/14 저녁 결정).' },
  { group: '상태', term: 'Coming soon / Open to join / Full / In training / Ended', note: '다섯 개가 전부입니다.' },
  { group: '로그인과 가입', term: 'Log in / Join TRAVI', note: '' },
  { group: '상단 메뉴', term: 'AI Cooperatives / Dashboard / Wallet / Whitepaper', note: '메뉴 이름과 순서만 정해졌습니다. 페이지 제목과 breadcrumb 을 AI Cooperatives 로 쓸지 Cooperatives 로 쓸지는 팀이 정할 일로 남아 있습니다.' },
  { group: '역할', term: 'Data provider / Compute provider / Model user / Leader', note: '' },
  { group: '보상', term: 'points (pts)', note: '현금 지급으로 읽히지 않게 points 로 씁니다.' },
  { group: '데이터', term: 'network flow records', note: '예시 데이터를 가리키는 말입니다.' },
  { group: '예시 Coop', term: 'SOC Threat Detection Coop', note: 'Security, Open to join' },
  { group: '예시 Coop', term: 'Botnet Traffic Detection Coop', note: 'Security, In training, Round 6 of 12' },
];

/* 본문 크기 후보에 따라 함께 움직이는 세 크기(px) */
const SIZE_PX: Record<Picked['size'], { lg: number; md: number; sm: number }> = {
  '16': { lg: 18, md: 16, sm: 14 },
  '15': { lg: 17, md: 15, sm: 13 },
  '14': { lg: 16, md: 14, sm: 13 },
};

const NOTES = [
  '입력칸과 보통 버튼의 테두리(--tv-line-strong)는 바탕과의 대비가 밝은 화면 1.5, 어두운 화면 1.7 입니다. tokens.css 가 적어 둔 기준은 3 이상입니다. 6번 "테두리 진하기"에서 기준을 넘는 값으로 바꿔 볼 수 있습니다.',
  '어두운 화면에서 채운 바탕 위의 글자색은 Button, Badge, Chip, Checkbox, Radio, Pagination, Stepper 까지 맞췄고 이 페이지에서 확인했습니다. 여기에 없는 Mantine 부품은 쓰기 시작할 때 어두운 화면에서 한 번 확인해야 합니다.',
  '예시의 12 days left 와 12 of 20 members 는 문구 틀만 정해졌고 숫자는 사이트의 더미 값입니다. 입력칸 이름 Email 과 버튼 이름 View Coop 은 지금 사이트에서 가져왔습니다.',
  '색 값은 travi_mock/ds/tokens.css 와 theme.ts 두 곳에 적혀 있습니다. 한쪽을 고친 뒤 npm run check:tokens 를 돌리면 어긋난 칸을 알려 줍니다.',
  '키보드로 짚은 곳의 테(--tv-focus)는 밝은 화면에서 흰 바탕과의 대비가 3.9 입니다.',
];

export function Catalog({ picked, paletteConfirmed }: { picked: Picked; paletteConfirmed: boolean }) {
  const px = SIZE_PX[picked.size];
  /* 색 계단과 역할의 배지. 회의에서 "이대로 확정"을 고르면 바뀐다 */
  const paletteVerdict: Verdict = paletteConfirmed ? 'fixed' : 'partial';
  const paletteText = paletteConfirmed ? '회의에서 확정으로 고름' : '주색만 확정, 나머지는 기본값';

  return (
    <Container size={1320} px="md" py="xl" style={{ wordBreak: 'keep-all' }}>
      <Group justify="space-between" align="flex-start" gap="md" mb="lg">
        <Box maw={720}>
          <Title order={1} fz="h2" ff="text">
            TRAVI 디자인 시스템 카탈로그
          </Title>
          <Text c="dimmed" mt={6}>
            지금까지 정한 것을 Mantine 테마 하나로 옮긴 페이지입니다. 아직 정하지 않은 것은 고르는 판에서 하나씩 골라 실제 부품에 입혀 볼 수 있습니다.
          </Text>
        </Box>
        <SchemeSwitch />
      </Group>

      <Box className={classes.layout}>
        <Box component="aside" className={classes.aside}>
          <MeetingPanel />
        </Box>

        <Box className={classes.main}>
          {/* 표지: 확정, 확인 전 기본값, 후보 */}
          <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
            <Card>
              <Group gap="sm" mb="sm">
                <Title order={2} fz="md" ff="text">
                  확정된 것
                </Title>
                <VerdictBadge verdict="fixed" />
              </Group>
              <List size="sm" spacing={6}>
                {FIXED_LIST.map((item) => (
                  <List.Item key={item}>{item}</List.Item>
                ))}
              </List>
            </Card>
            <Card>
              <Group gap="sm" mb="sm">
                <Title order={2} fz="md" ff="text">
                  기본값으로 넣어 둔 것
                </Title>
                <VerdictBadge verdict={paletteConfirmed ? 'fixed' : 'defaulted'} text={paletteConfirmed ? '회의에서 확정으로 고름' : undefined} />
              </Group>
              <List size="sm" spacing={6}>
                {DEFAULTED_LIST.map((item) => (
                  <List.Item key={item}>{item}</List.Item>
                ))}
              </List>
              <Text size="sm" c="dimmed" mt="sm">
                제안한 값이고 유준이 직접 확정한 적은 없습니다. 9번 "색 기본값"에서 정합니다.
              </Text>
            </Card>
            <Card>
              <Group gap="sm" mb="sm">
                <Title order={2} fz="md" ff="text">
                  아직 후보인 것
                </Title>
                <VerdictBadge verdict="candidate" />
              </Group>
              <List size="sm" spacing={6}>
                {CANDIDATE_LIST.map((item) => (
                  <List.Item key={item}>{item}</List.Item>
                ))}
              </List>
            </Card>
          </SimpleGrid>

          <Section id="sec-type" title="글자" verdict="candidate" lead="글꼴 조합과 본문 크기는 아직 고르는 중입니다. 1번과 2번에서 고르면 아래 견본이 바뀝니다. 견본의 영어는 확정된 표기입니다.">
            <Card>
              <Stack gap="var(--tv-gap)">
                <Box>
                  <Text size="xs" c="dimmed">
                    큰 제목. 후보 B 에서 세리프가 됩니다
                  </Text>
                  <Title order={1}>SOC Threat Detection Coop</Title>
                  <Title order={2} mt={4}>
                    Botnet Traffic Detection Coop
                  </Title>
                </Box>
                <Divider />
                <Box>
                  <Text size="xs" c="dimmed">
                    소개 문단 {px.lg}px
                  </Text>
                  <Text size="lg">Data provider, Compute provider, Model user, Leader. 제목 바로 아래에 오는 문단의 크기입니다.</Text>
                </Box>
                <Box>
                  <Text size="xs" c="dimmed">
                    본문 {px.md}px
                  </Text>
                  <Text>Coming soon, Open to join, Full, In training, Ended. 가장 많이 읽게 되는 글자의 크기입니다.</Text>
                </Box>
                <Box>
                  <Text size="xs" c="dimmed">
                    보조 글자 {px.sm}px
                  </Text>
                  <Text size="sm">AI Cooperatives, Dashboard, Wallet, Whitepaper. 버튼, 메뉴, 설명에 쓰는 크기입니다.</Text>
                </Box>
                <Divider />
                <Box>
                  <Text size="xs" c="dimmed">
                    숫자와 작은 라벨. 후보 C 에서 고정폭이 됩니다
                  </Text>
                  <Group gap="lg" align="baseline">
                    <Text fz={30} fw={600} lh={1.2} className={classes.data}>
                      6 of 12
                    </Text>
                    <Text size="sm" c="dimmed" className={classes.data}>
                      Round 6 of 12 · 12 of 20 members · pts
                    </Text>
                  </Group>
                </Box>
              </Stack>
            </Card>
            <Text size="sm" c="dimmed" mt="sm">
              제목 크기 제안(56, 40, 28, 20)은 아직 테마에 넣지 않아서 위 제목은 Mantine 기본 크기(34, 26)로 보입니다.
            </Text>
          </Section>

          <Divider />

          <Section
            id="sec-parts"
            title="Mantine 부품"
            verdict="partial"
            verdictText="주색 확정, 모양은 후보"
            lead="Mantine 이 만들어 둔 부품에 우리 테마를 입힌 모습입니다. 3번 모서리, 5번 버튼, 6번 테두리 진하기를 고르면 여기가 바뀝니다."
          >
            <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="md">
              <Sample name="Button" note="채운 것이 가장 중요한 버튼, 테두리만 있는 것이 보통 버튼입니다.">
                <Group gap="xs">
                  <Button>Join TRAVI</Button>
                  <Button variant="default">Log in</Button>
                  <Button variant="light">View Coop</Button>
                  <Button variant="subtle">Whitepaper</Button>
                </Group>
              </Sample>

              <Sample name="TextInput" note="눌러서 짚으면 테두리가 밝은 남색(--tv-focus)으로 바뀝니다. 둘째 칸은 오류일 때의 빨간 테두리입니다.">
                <Stack gap="sm">
                  <TextInput label="Email" />
                  <TextInput aria-label="오류 상태의 입력칸" error />
                </Stack>
              </Sample>

              <Sample name="Tabs" note="탭을 누르면 아래 내용이 바뀝니다. 이름은 확정된 상단 메뉴 넷입니다.">
                <Tabs defaultValue="coops">
                  <Tabs.List>
                    <Tabs.Tab value="coops">AI Cooperatives</Tabs.Tab>
                    <Tabs.Tab value="dashboard">Dashboard</Tabs.Tab>
                    <Tabs.Tab value="wallet">Wallet</Tabs.Tab>
                    <Tabs.Tab value="whitepaper">Whitepaper</Tabs.Tab>
                  </Tabs.List>
                  <Tabs.Panel value="coops" pt="sm">
                    <Text size="sm">첫째 탭의 내용 자리</Text>
                  </Tabs.Panel>
                  <Tabs.Panel value="dashboard" pt="sm">
                    <Text size="sm">둘째 탭의 내용 자리</Text>
                  </Tabs.Panel>
                  <Tabs.Panel value="wallet" pt="sm">
                    <Text size="sm">셋째 탭의 내용 자리</Text>
                  </Tabs.Panel>
                  <Tabs.Panel value="whitepaper" pt="sm">
                    <Text size="sm">넷째 탭의 내용 자리</Text>
                  </Tabs.Panel>
                </Tabs>
              </Sample>

              <Sample name="Badge" note="작은 딱지입니다. 역할 이름 넷을 Mantine 이 주는 네 가지 모양으로 놓았습니다.">
                <Group gap="xs">
                  <Badge>Leader</Badge>
                  <Badge variant="light">Data provider</Badge>
                  <Badge variant="outline">Compute provider</Badge>
                  <Badge variant="default">Model user</Badge>
                </Group>
              </Sample>
            </SimpleGrid>
            <Text size="sm" c="dimmed" mt="md">
              이 상자들이 Card 입니다. 바탕은 <Code>--tv-surface</Code>, 테두리는 <Code>--tv-line</Code> 을 씁니다.
            </Text>
          </Section>

          <Divider />

          <Section
            id="sec-status"
            title="상태 칩"
            verdict="partial"
            verdictText="이름 확정, 색 배정은 후보"
            lead="Coop 의 상태 다섯 가지입니다. 이름은 확정입니다. 모양은 지금 사이트의 칩과 같고, 어느 상태에 어느 색을 붙일지는 7번에서 고릅니다."
          >
            <Group gap="xs">
              {COOP_STATUSES.map((status) => (
                <StatusChip key={status} status={status} />
              ))}
            </Group>
            <Group gap="xs" mt="sm">
              <StatusChip status="open" note="12 days left" />
            </Group>
          </Section>

          <Divider />

          <Section
            id="sec-domain"
            title="분야 칩"
            verdict="defaulted"
            verdictText="색은 기본값, 모양은 후보"
            lead="Coop 이 속한 분야 다섯 가지입니다. 색은 사이트의 분야 아이콘이 쓰는 값과 같습니다. 이 칩에는 아이콘 없이 색 점과 이름만 둡니다."
          >
            <Group gap="xs">
              {COOP_DOMAINS.map((domain) => (
                <DomainChip key={domain} domain={domain} />
              ))}
            </Group>
          </Section>

          <Divider />

          <Section
            id="sec-coop"
            title="CoopCard"
            verdict="partial"
            verdictText="이름과 상태 확정, 배치는 후보"
            lead="우리가 만든 부품입니다. Mantine 의 Card, Button, Progress 에 상태 칩과 분야 칩을 얹었습니다. Coop 이름, 상태, Round 6 of 12 는 확정이고 나머지 숫자는 사이트의 더미 값입니다. 4번 간격과 8번 카드를 고르면 여기가 바뀝니다."
          >
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="var(--tv-gap-section)">
              {EXAMPLE_COOPS.map((coop) => (
                <CoopCard key={coop.name} {...coop} />
              ))}
            </SimpleGrid>
          </Section>

          <Divider />

          <Section id="sec-more" title="그 밖의 Mantine 부품" lead="채운 바탕 위의 표시가 어두운 화면에서도 읽히는지 보려고 둔 부품입니다. 오른쪽 위에서 어둡게로 바꿔 보세요. 쓸지 말지는 아직 정하지 않았습니다.">
            <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="md">
              <Sample name="Checkbox, Radio, Switch" note="켜진 칸 안의 표시가 바탕과 구분되어야 합니다.">
                <Stack gap="sm">
                  <Checkbox defaultChecked label="Data provider" />
                  <Radio.Group defaultValue="model" aria-label="역할 고르기 예시">
                    <Group gap="md">
                      <Radio value="model" label="Model user" />
                      <Radio value="compute" label="Compute provider" />
                    </Group>
                  </Radio.Group>
                  <Switch defaultChecked label="Leader" />
                </Stack>
              </Sample>
              <Sample name="Chip, Pagination, Stepper" note="고른 것과 지금 위치를 채운 바탕으로 알립니다.">
                <Stack gap="md">
                  <Chip.Group defaultValue="open">
                    <Group gap="xs">
                      <Chip value="open">Open to join</Chip>
                      <Chip value="training">In training</Chip>
                    </Group>
                  </Chip.Group>
                  <Pagination total={5} defaultValue={2} size="sm" />
                  <Stepper active={2} size="xs" aria-label="단계 표시 예시">
                    <Stepper.Step />
                    <Stepper.Step />
                    <Stepper.Step />
                    <Stepper.Step />
                  </Stepper>
                </Stack>
              </Sample>
            </SimpleGrid>
          </Section>

          <Divider />

          <Section id="sec-scale" title="색 계단" verdict={paletteVerdict} verdictText={paletteText} lead="색의 원재료입니다. 0이 가장 밝고 9가 가장 어둡습니다. 화면에서는 이 칸을 직접 쓰지 않고 아래의 역할 이름으로 씁니다. 유준이 직접 정한 것은 indigo(주색) 한 줄이고 나머지는 제안한 기본값입니다.">
            <Stack gap="lg">
              {SCALES.map((scale) => (
                <ScaleRow key={scale.key} scaleKey={scale.key} name={scale.name} note={scale.note} />
              ))}
            </Stack>
          </Section>

          <Divider />

          <Section id="sec-role" title="색의 역할" verdict={paletteVerdict} verdictText={paletteText} lead="화면이 실제로 쓰는 이름입니다. 같은 이름이 밝은 화면과 어두운 화면에서 다른 칸을 가리킵니다. 가장 중요한 버튼이 남색이라는 것까지가 확정이고, 어느 칸을 링크, 짚은 곳의 테, 가라앉은 바탕으로 쓸지는 제안한 기본값입니다.">
            <SimpleGrid cols={{ base: 1, xs: 2, lg: 3 }} spacing="md">
              {ROLES.map((role) => (
                <RoleItem key={role.name} name={role.name} use={role.use} />
              ))}
            </SimpleGrid>
          </Section>

          <Divider />

          <Section id="sec-terms" title="용어 표" verdict="fixed" lead="화면에 쓰는 영어 표기입니다. 여기 적힌 것만 확정입니다.">
            <Table verticalSpacing="sm" layout="fixed">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th w="22%">구분</Table.Th>
                  <Table.Th>확정 표기</Table.Th>
                  <Table.Th w="38%">덧붙임</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {TERMS.map((row) => (
                  <Table.Tr key={row.term}>
                    <Table.Td>{row.group}</Table.Td>
                    <Table.Td fw={600}>{row.term}</Table.Td>
                    <Table.Td c="dimmed">{row.note}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Section>

          <Divider />

          <Section id="sec-notes" title="알아 둘 것" lead="아직 맞추지 못했거나 확인이 필요한 점입니다.">
            <List size="sm" spacing="sm" maw={760}>
              {NOTES.map((note) => (
                <List.Item key={note}>{note}</List.Item>
              ))}
            </List>
          </Section>
        </Box>
      </Box>

      <BackToMeeting />
    </Container>
  );
}
