import type { CoopCardProps } from '../framework/ui';

/* 예시 Coop 두 개. 이름, 분야, 상태, Round 6 of 12 는 확정이다(11/14 저녁, 11/15 저녁).
   12 days left 와 12 of 20 members 는 문구 틀만 정해졌고 숫자는 사이트(travi_mock/app.js)의 더미 값이다.
   소개 한 줄과 날짜는 확정 목록에 없어서 넣지 않았다 */
export const EXAMPLE_COOPS: CoopCardProps[] = [
  {
    name: 'SOC Threat Detection Coop',
    domain: 'security',
    status: 'open',
    statusNote: '12 days left',
    facts: ['12 of 20 members'],
  },
  {
    name: 'Botnet Traffic Detection Coop',
    domain: 'security',
    status: 'training',
    round: { current: 6, total: 12 },
  },
];
