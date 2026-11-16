// 색 값이 두 곳에 적혀 있어서(travi_mock/ds/tokens.css 와 src/framework/ui/theme.ts) 한쪽만 고치면 어긋난다.
// 이 스크립트가 색 계단 6줄과 분야 색 5개를 비교해 다른 칸을 알려 준다. 실행: npm run check:tokens

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const tokensPath = fileURLToPath(new URL('../../travi_mock/ds/tokens.css', import.meta.url));
const themePath = fileURLToPath(new URL('../src/framework/ui/theme.ts', import.meta.url));

let tokens;
try {
  tokens = readFileSync(tokensPath, 'utf8');
} catch {
  console.error(`tokens.css 를 찾지 못했습니다: ${tokensPath}`);
  process.exit(1);
}
const theme = readFileSync(themePath, 'utf8');
const problems = [];

// 1) 색 계단. theme.ts 의 "const indigo: MantineColorsTuple = [...]" 과 tokens.css 의 --tv-indigo-0 ~ 9
for (const name of ['indigo', 'gray', 'dark', 'green', 'amber', 'red']) {
  const line = theme.match(new RegExp(`const ${name}: MantineColorsTuple = \\[([^\\]]+)\\]`));
  const inTheme = line ? [...line[1].matchAll(/#[0-9a-fA-F]{6}/g)].map((m) => m[0].toLowerCase()) : [];
  for (let step = 0; step < 10; step++) {
    const found = tokens.match(new RegExp(`--tv-${name}-${step}:\\s*(#[0-9a-fA-F]{6})`));
    const inTokens = found ? found[1].toLowerCase() : '(없음)';
    if (inTheme[step] !== inTokens) problems.push(`${name} ${step}번: theme.ts ${inTheme[step] ?? '(없음)'}, tokens.css ${inTokens}`);
  }
}

// 2) 분야 색. tokens.css 에서 처음 나오는 값이 밝은 화면, [data-theme="dark"] 구역의 값이 어두운 화면
const darkBlock = tokens.slice(tokens.indexOf('[data-theme="dark"] {'));
for (const name of ['security', 'finance', 'agriculture', 'healthcare', 'other']) {
  const inTheme = theme.match(new RegExp(`${name}: \\{ light: '(#[0-9a-fA-F]{6})', dark: '(#[0-9a-fA-F]{6})'`));
  const light = tokens.match(new RegExp(`--tv-domain-${name}:\\s*(#[0-9a-fA-F]{6})`));
  const dark = darkBlock.match(new RegExp(`--tv-domain-${name}:\\s*(#[0-9a-fA-F]{6})`));
  if (!inTheme || !light || !dark) {
    problems.push(`분야 색 ${name}: 값을 찾지 못했습니다`);
    continue;
  }
  if (inTheme[1].toLowerCase() !== light[1].toLowerCase()) problems.push(`분야 색 ${name} 밝은 화면: theme.ts ${inTheme[1]}, tokens.css ${light[1]}`);
  if (inTheme[2].toLowerCase() !== dark[1].toLowerCase()) problems.push(`분야 색 ${name} 어두운 화면: theme.ts ${inTheme[2]}, tokens.css ${dark[1]}`);
}

if (problems.length > 0) {
  console.error(`어긋난 곳 ${problems.length}개`);
  for (const problem of problems) console.error(`  ${problem}`);
  process.exit(1);
}
console.log('색 계단 60칸과 분야 색 10개가 tokens.css 와 같습니다. 역할 배정(어느 칸을 어디에 쓰는지)은 이 검사에 들어 있지 않습니다.');
