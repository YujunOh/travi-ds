/* 아직 정하지 않은 모양 값의 후보. 이름과 값은 travi_mock/ds/tokens.css 의 '후보' 구역,
   회의용 페이지 travi_mock/design-system.html 의 단계 이름과 같다(type, size, radius, density, btn, chips, card).
   edge 하나만 이 프로젝트에서 더했다. 테두리 대비가 기준 3 에 못 미치는 것을 회의에서 정하기 위한 것이다 */

export const CANDIDATE_VALUES = {
  /* 글꼴 조합. a Pretendard 하나, b 큰 제목만 Source Serif 4, c 숫자와 라벨만 Geist Mono */
  type: ['a', 'b', 'c'],
  /* 본문 글자 크기(px) */
  size: ['16', '15', '14'],
  /* 버튼 모서리. 입력칸과 카드가 따라간다 */
  radius: ['4', '8', '12', 'pill'],
  /* 간격 */
  density: ['compact', 'normal', 'roomy'],
  /* 보통 버튼의 테두리(회색, 글자색)와 버튼 높이 */
  btn: ['gray-36', 'gray-42', 'ink-36', 'ink-42'],
  /* 상태 칩의 색 배정 */
  chips: ['site', 'green', 'mono'],
  /* 카드를 구분하는 방법 */
  card: ['line', 'hover', 'shadow'],
  /* 입력칸과 보통 버튼의 테두리 진하기 */
  edge: ['soft', 'strong'],
} as const;

export type CandidateId = keyof typeof CANDIDATE_VALUES;
export type Picked = { [K in CandidateId]: (typeof CANDIDATE_VALUES)[K][number] };

/* 아무것도 고르지 않았을 때 보이는 임시 기본값. tokens.css 의 :root 값, design-system.html 의 def 와 같다 */
export const DEFAULT_PICKED: Picked = {
  type: 'a',
  size: '16',
  radius: '8',
  density: 'normal',
  btn: 'gray-36',
  chips: 'site',
  card: 'line',
  edge: 'soft',
};

/* 고른 값 일부만 받아 나머지를 임시 기본값으로 채운다. 목록에 없는 값은 버린다 */
export function resolvePicked(partial: Partial<Record<string, string>>): Picked {
  const out: Record<string, string> = { ...DEFAULT_PICKED };
  for (const id of Object.keys(CANDIDATE_VALUES) as CandidateId[]) {
    const value = partial[id];
    if (value !== undefined && (CANDIDATE_VALUES[id] as readonly string[]).includes(value)) out[id] = value;
  }
  return out as Picked;
}
