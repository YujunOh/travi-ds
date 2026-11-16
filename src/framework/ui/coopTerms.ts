/* Coop 의 상태와 분야에 쓰는 이름. 부품 파일과 따로 둔다(부품 파일은 부품만 내보내야 저장할 때 화면이 바로 갱신된다) */

/* 상태 다섯 가지. 이름은 확정이다(11/14). 화면에는 이 표기만 쓴다 */
export const COOP_STATUSES = ['coming', 'open', 'full', 'training', 'ended'] as const;
export type CoopStatus = (typeof COOP_STATUSES)[number];

export const STATUS_LABEL: Record<CoopStatus, string> = {
  coming: 'Coming soon',
  open: 'Open to join',
  full: 'Full',
  training: 'In training',
  ended: 'Ended',
};

/* 분야 다섯 가지. 색은 사이트의 분야 아이콘이 쓰는 값과 같다 */
export const COOP_DOMAINS = ['security', 'finance', 'agriculture', 'healthcare', 'other'] as const;
export type CoopDomain = (typeof COOP_DOMAINS)[number];

export const DOMAIN_LABEL: Record<CoopDomain, string> = {
  security: 'Security',
  finance: 'Finance',
  agriculture: 'Agriculture',
  healthcare: 'Healthcare',
  other: 'Other',
};
