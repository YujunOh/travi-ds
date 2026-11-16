import { DEFAULT_PICKED, type CandidateId } from '../framework/ui';

/* 회의에서 고를 것 아홉 가지. 앞의 일곱 개는 회의용 페이지 travi_mock/design-system.html 과 같은 이름, 같은 값이라
   거기서 받은 주소의 # 뒤 부분을 이 페이지 주소에 그대로 붙일 수 있다. edge 와 palette 는 이 페이지에만 있다.
   설명 문장은 design-system.html 의 것을 줄여 옮겼다 */

export type DecisionId = CandidateId | 'palette';
export type Choice = Partial<Record<DecisionId, string>>;

export type Decision = {
  id: DecisionId;
  /* 목록에 보이는 짧은 이름 */
  name: string;
  /* 물음 한 줄 */
  ask: string;
  /* 고르면 바뀌는 구역의 id 와 이름 */
  target: string;
  targetName: string;
  /* 아무것도 안 골랐을 때 화면에 보이는 값 */
  shownByDefault: string;
  options: { value: string; name: string; line: string }[];
};

export const DECISIONS: Decision[] = [
  {
    id: 'type',
    name: '글꼴',
    ask: '글꼴 조합을 골라 주세요.',
    target: 'sec-type',
    targetName: '글자',
    shownByDefault: DEFAULT_PICKED.type,
    options: [
      { value: 'a', name: 'A Pretendard 하나로', line: '제목, 본문, 숫자가 모두 Pretendard 입니다. 지금 사이트와 같습니다.' },
      { value: 'b', name: 'B 큰 제목만 세리프', line: '큰 제목은 Source Serif 4, 나머지는 Pretendard 입니다. 한글 제목에는 적용되지 않습니다.' },
      { value: 'c', name: 'C 숫자와 라벨만 고정폭', line: '숫자와 작은 라벨은 Geist Mono, 나머지는 Pretendard 입니다.' },
    ],
  },
  {
    id: 'size',
    name: '글자 크기',
    ask: '본문 글자 크기를 골라 주세요.',
    target: 'sec-type',
    targetName: '글자',
    shownByDefault: DEFAULT_PICKED.size,
    options: [
      { value: '16', name: '본문 16px', line: '소개 문단 18, 본문 16, 보조 글자 14. Mantine 기본 크기와 같습니다.' },
      { value: '15', name: '본문 15px', line: '소개 문단 17, 본문 15, 보조 글자 13. 지금 사이트의 카드 안 문단이 15 입니다.' },
      { value: '14', name: '본문 14px', line: '소개 문단 16, 본문 14, 보조 글자 13. 지금 사이트에서 가장 많이 쓰인 크기입니다.' },
    ],
  },
  {
    id: 'radius',
    name: '모서리',
    ask: '모서리를 얼마나 둥글게 할지 골라 주세요.',
    target: 'sec-parts',
    targetName: 'Mantine 부품',
    shownByDefault: DEFAULT_PICKED.radius,
    options: [
      { value: '4', name: '4px', line: '버튼과 입력칸 4, 카드 8. 각진 인상이 가장 강합니다.' },
      { value: '8', name: '8px', line: '버튼과 입력칸 8, 카드 12. Figma 와이어프레임과 Mantine 기본값이 이 값입니다.' },
      { value: '12', name: '12px', line: '버튼과 입력칸 12, 카드 16.' },
      { value: 'pill', name: '알약', line: '버튼은 알약, 입력칸 10, 카드 16. 지금 사이트의 버튼이 이 모양입니다.' },
    ],
  },
  {
    id: 'density',
    name: '간격',
    ask: '간격을 얼마나 넉넉하게 둘지 골라 주세요.',
    target: 'sec-coop',
    targetName: 'CoopCard',
    shownByDefault: DEFAULT_PICKED.density,
    options: [
      { value: 'compact', name: '촘촘', line: '카드 안쪽 16, 줄 사이 8.' },
      { value: 'normal', name: '보통', line: '카드 안쪽 24, 줄 사이 12. 지금 사이트의 기본 카드가 24 입니다.' },
      { value: 'roomy', name: '넉넉', line: '카드 안쪽 32, 줄 사이 16.' },
    ],
  },
  {
    id: 'btn',
    name: '버튼',
    ask: '보통 버튼의 테두리와 버튼 높이를 골라 주세요.',
    target: 'sec-parts',
    targetName: 'Mantine 부품',
    shownByDefault: DEFAULT_PICKED.btn,
    options: [
      { value: 'gray-36', name: '회색 테두리, 높이 36', line: '보통 버튼은 옅은 회색 테두리입니다. 지금 사이트의 기본 높이가 37 입니다.' },
      { value: 'gray-42', name: '회색 테두리, 높이 42', line: 'Figma 버튼 높이가 41 부터 49 사이입니다.' },
      { value: 'ink-36', name: '진한 테두리, 높이 36', line: '보통 버튼은 글자와 같은 색의 테두리입니다.' },
      { value: 'ink-42', name: '진한 테두리, 높이 42', line: '진한 테두리에 높이 42 입니다.' },
    ],
  },
  {
    id: 'edge',
    name: '테두리 진하기',
    ask: '입력칸과 보통 버튼의 테두리를 얼마나 진하게 할지 골라 주세요.',
    target: 'sec-parts',
    targetName: 'Mantine 부품',
    shownByDefault: DEFAULT_PICKED.edge,
    options: [
      { value: 'soft', name: '지금 값', line: '밝은 화면 #cfd5e1, 어두운 화면 #34405a. 바탕과의 대비가 1.5, 1.7 이라 기준 3 에 못 미칩니다.' },
      { value: 'strong', name: '또렷하게', line: '밝은 화면 #6a7388(대비 4.8), 어두운 화면 #77829a(대비 4.6). 기준은 넘지만 선이 무거워 보일 수 있습니다.' },
    ],
  },
  {
    id: 'chips',
    name: '칩 색',
    ask: '어느 상태에 어느 색을 붙일지 골라 주세요. 상태 이름 다섯 개는 이미 정해졌습니다.',
    target: 'sec-status',
    targetName: '상태 칩',
    shownByDefault: DEFAULT_PICKED.chips,
    options: [
      { value: 'site', name: 'Open to join 남색', line: 'Open to join 남색, In training 초록, Full 노랑. 지금 사이트의 색입니다.' },
      { value: 'green', name: 'Open to join 초록', line: 'Open to join 초록, In training 남색, Full 노랑.' },
      { value: 'mono', name: '상태는 회색으로', line: '상태 칩은 모두 회색 계열이고 Open to join 만 진하게 합니다.' },
    ],
  },
  {
    id: 'card',
    name: '카드',
    ask: '카드를 무엇으로 구분할지 골라 주세요.',
    target: 'sec-coop',
    targetName: 'CoopCard',
    shownByDefault: DEFAULT_PICKED.card,
    options: [
      { value: 'line', name: '테두리만', line: '옅은 선 하나로 구분합니다.' },
      { value: 'hover', name: '테두리, 올리면 그림자', line: '평소에는 선만 있고 마우스를 올리면 살짝 뜹니다. 아래 CoopCard 에 올려 보세요.' },
      { value: 'shadow', name: '옅은 그림자', line: '선 없이 그림자로 구분합니다. 어두운 화면에서는 그림자가 거의 보이지 않습니다.' },
    ],
  },
  {
    id: 'palette',
    name: '색 기본값',
    ask: '회색, 상태색, 분야색의 값과 역할 배정을 지금 값으로 확정할지 골라 주세요. 주색 남색은 이미 정해졌습니다.',
    target: 'sec-role',
    targetName: '색의 역할',
    shownByDefault: 'hold',
    options: [
      { value: 'ok', name: '이대로 확정', line: '아래 색 계단과 색의 역할을 지금 값으로 확정합니다.' },
      { value: 'hold', name: '더 보고 정함', line: '기본값으로 두고 다음에 다시 봅니다.' },
    ],
  },
];

export function optionOf(decision: Decision, value: string | undefined) {
  return decision.options.find((option) => option.value === value);
}

/* 주소 뒤 값과 저장된 값에서 아는 것만 골라낸다 */
export function cleanChoice(raw: Record<string, unknown>): Choice {
  const out: Choice = {};
  for (const decision of DECISIONS) {
    const value = raw[decision.id];
    if (typeof value === 'string' && optionOf(decision, value)) out[decision.id] = value;
  }
  return out;
}

/* 회의 결과를 글로 옮긴다. 메신저에 붙여 넣을 용도 */
export function resultText(choice: Choice): string {
  const lines = DECISIONS.map((decision) => {
    const picked = optionOf(decision, choice[decision.id]);
    return `${decision.name}: ${picked ? picked.name : '아직 안 고름'}`;
  });
  return ['TRAVI 디자인 시스템 회의 결과 (travi-ds 카탈로그)', ...lines].join('\n');
}
