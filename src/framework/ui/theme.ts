/* TRAVI 의 Mantine 테마. 색 값은 travi_mock/ds/tokens.css 와 같다(값을 바꾸면 두 곳을 같이 고치고 npm run check:tokens 로 확인한다).
   Next 로 옮기면 이 파일 첫 줄에 'use client' 한 줄만 더한다. 나머지는 그대로 쓴다.

   유준이 직접 정한 것: 주색 남색(11/15)
   기본값으로 넣어 둔 것(확인 전): 회색, 상태색, 분야색의 값과 역할 배정
   후보: 글꼴, 글자 크기, 모서리, 간격, 버튼 모양, 칩 색 배정, 카드 모양, 테두리 진하기.
         buildTheme 에 고른 값을 넘기면 그 값으로 테마가 만들어진다. 후보 목록은 candidates.ts 에 있다 */

import {
  Badge,
  Button,
  Card,
  Checkbox,
  Chip,
  Input,
  Pagination,
  Paper,
  Radio,
  Stepper,
  Tabs,
  createTheme,
  defaultVariantColorsResolver,
  isLightColor,
  rem,
  type CSSVariablesResolver,
  type MantineColorsTuple,
  type MantineTheme,
  type VariantColorsResolver,
} from '@mantine/core';
import { DEFAULT_PICKED, type Picked } from './candidates';
import classes from './theme.module.css';

/* 1) 색 계단. 0이 가장 밝고 9가 가장 어둡다. tokens.css 의 --tv-<이름>-0 ~ 9 와 같은 값 */
const indigo: MantineColorsTuple = ['#f5f6ff', '#eceefe', '#c8cdfb', '#a8b6ff', '#8598fe', '#6075fd', '#3f4ff0', '#3139d3', '#2529af', '#1a1c88'];
const gray: MantineColorsTuple = ['#fbfbfd', '#f2f4f8', '#e3e7ef', '#cfd5e1', '#aeb6c5', '#8e97a9', '#6a7388', '#586276', '#2c3446', '#0d1220'];
const dark: MantineColorsTuple = ['#e8ecf5', '#c5cddc', '#a3adc2', '#77829a', '#34405a', '#232c40', '#121828', '#0b0f1a', '#080b14', '#05070d'];
const green: MantineColorsTuple = ['#eef8f3', '#ddede3', '#bfe3cf', '#99c8ac', '#71b28d', '#48996f', '#1d7d52', '#006840', '#015332', '#003e24'];
const amber: MantineColorsTuple = ['#fdf7ea', '#f7eada', '#f0d9a8', '#e8c496', '#deae6f', '#cf9748', '#bb8022', '#a46c07', '#8a5a00', '#704a07'];
const red: MantineColorsTuple = ['#fdf1f0', '#fde2de', '#f2c6c2', '#f1a89f', '#e6877b', '#d36559', '#b8443b', '#9d362e', '#82231e', '#651915'];

/* 분야 색. 밝은 화면과 어두운 화면에서 값이 다르다 */
export const domainColors = {
  security: { light: '#51628e', dark: '#a5b7e2' },
  finance: { light: '#7f643a', dark: '#d2ba91' },
  agriculture: { light: '#4d7357', dark: '#a3c9ac' },
  healthcare: { light: '#8f565d', dark: '#dea7ac' },
  other: { light: '#616978', dark: '#afb8c7' },
} as const;

/* 글꼴 묶음. tokens.css 의 --tv-font-sans, --tv-font-serif, --tv-font-mono 와 같다 */
const FONT_SANS = "'Pretendard Variable', Pretendard, system-ui, -apple-system, 'Segoe UI', sans-serif";
const FONT_SERIF = "'Source Serif 4', Georgia, 'Times New Roman', serif";
const FONT_MONO = "'Geist Mono', ui-monospace, 'SFMono-Regular', Consolas, monospace";

/* 2) 후보 값 표. tokens.css 의 '후보' 구역과 같은 숫자다 */
const SIZE = {
  '16': { sm: 14, md: 16, lg: 18 },
  '15': { sm: 13, md: 15, lg: 17 },
  '14': { sm: 13, md: 14, lg: 16 },
} as const;
const RADIUS = {
  '4': { control: 4, input: 4, card: 8 },
  '8': { control: 8, input: 8, card: 12 },
  '12': { control: 12, input: 12, card: 16 },
  pill: { control: 999, input: 10, card: 16 },
} as const;
const DENSITY = {
  compact: { pad: 16, gap: 8, section: 16 },
  normal: { pad: 24, gap: 12, section: 24 },
  roomy: { pad: 32, gap: 16, section: 32 },
} as const;
const SHADOW_SM = '0 1px 3px rgba(0, 0, 0, 0.05), 0 10px 15px -5px rgba(0, 0, 0, 0.05), 0 7px 7px -5px rgba(0, 0, 0, 0.04)';
const SHADOW_HOVER = '0 14px 30px -20px rgba(13, 18, 32, 0.35)';

/* 채운 바탕 위의 글자색. Mantine 의 autoContrast 는 밝은 화면의 칸(6번)만 보고 흰 글자를 고르기 때문에
   어두운 화면의 4번 바탕에서도 흰 글자가 되어 대비가 2.65 로 떨어진다. 화면별로 계산해 둔 --tv-on-<색> 을 쓰게 한다.
   Button, Badge, ActionIcon, Chip 은 아래 variantColorResolver 로, Checkbox, Radio, Pagination, Stepper 는
   components 의 vars 로 고친다. 그 밖에 글자색을 따로 계산하는 부품은 쓰기 시작할 때 어두운 화면에서 확인한다 */
const onColorOf = (t: MantineTheme, color?: string) => {
  const name = color ?? t.primaryColor;
  return name in t.colors ? `var(--tv-on-${name})` : undefined;
};

const variantColorResolver: VariantColorsResolver = (input) => {
  const result = defaultVariantColorsResolver(input);
  const on = onColorOf(input.theme, input.color);
  if (input.variant === 'filled' && on) return { ...result, color: on };
  return result;
};

/* 고른 후보 값으로 테마를 만든다. 아무것도 넘기지 않으면 임시 기본값이다 */
export function buildTheme(picked: Picked = DEFAULT_PICKED) {
  const size = SIZE[picked.size];
  const radius = RADIUS[picked.radius];
  const density = DENSITY[picked.density];
  const tall = picked.btn.endsWith('42');
  const control = { height: tall ? 42 : 36, padX: tall ? 18 : 14 };
  /* 크기를 따로 적지 않은 버튼과 입력칸에만 후보 높이를 입힌다 */
  const usesDefaultSize = (value: unknown) => value === undefined || value === 'sm';

  return createTheme({
    colors: { indigo, gray, dark, green, amber, red },
    primaryColor: 'indigo',
    /* 채운 버튼이 쓰는 칸. 밝은 화면은 6번(#3f4ff0), 어두운 화면은 4번(#8598fe) */
    primaryShade: { light: 6, dark: 4 },
    /* 바탕이 밝으면 검은 글자, 어두우면 흰 글자를 자동으로 고른다 */
    autoContrast: true,
    variantColorResolver,
    white: '#ffffff',
    black: gray[9],
    /* 키보드로 짚은 곳의 테를 --tv-focus 로 그린다 */
    focusClassName: classes.focus,

    /* 글꼴(후보). A 는 전부 Pretendard, B 는 큰 제목만 세리프, C 는 숫자와 라벨만 고정폭(--tv-font-data) */
    fontFamily: FONT_SANS,
    fontFamilyMonospace: picked.type === 'c' ? FONT_MONO : undefined,
    headings: picked.type === 'b' ? { fontFamily: FONT_SERIF, fontWeight: '600' } : { fontFamily: FONT_SANS, fontWeight: '700' },

    /* 글자 크기(후보). 본문 크기에 따라 소개 문단(lg)과 보조 글자(sm)가 같이 움직인다. 칩(xs 12)은 그대로다.
       제목 크기 다섯 가지(56, 40, 28, 20 과 좁은 화면 값)는 아직 테마에 넣지 않았다 */
    fontSizes: { sm: rem(size.sm), md: rem(size.md), lg: rem(size.lg) },

    /* 모서리(후보). 버튼 값을 고르면 입력칸과 카드가 따라간다 */
    defaultRadius: picked.radius === 'pill' ? 10 : radius.control,

    components: {
      /* 카드 바탕과 테두리를 역할 값에 맞춘다. 안쪽 여백은 간격 후보, 모서리는 모서리 후보를 따른다 */
      Paper: Paper.extend({ classNames: { root: classes.paper } }),
      Card: Card.extend({
        defaultProps: { withBorder: true, padding: density.pad, radius: radius.card },
        classNames: { root: classes.card },
      }),
      Button: Button.extend({
        defaultProps: { radius: radius.control },
        classNames: { root: classes.button },
        vars: (_t, props) => ({
          root: usesDefaultSize(props.size) ? { '--button-height': rem(control.height), '--button-padding-x': rem(control.padX) } : {},
        }),
      }),
      /* 입력칸 높이는 버튼과 같다. 테두리 색은 theme.module.css 가 정한다 */
      Input: Input.extend({
        defaultProps: { radius: radius.input },
        classNames: { wrapper: classes.inputWrapper },
        vars: (_t, props) => ({
          wrapper: usesDefaultSize(props.size) ? { '--input-height': rem(control.height) } : {},
        }),
      }),
      /* Mantine 의 Badge 는 글자를 전부 대문자로 바꾼다. 표기(Coop, Data provider)가 깨지지 않게 끈다 */
      Badge: Badge.extend({
        /* variant 를 적어 두어야 위의 variantColorResolver 를 거친다. 안 적으면 어두운 화면에서 흰 글자가 된다 */
        defaultProps: { variant: 'filled' },
        styles: { label: { textTransform: 'none' } },
      }),
      Chip: Chip.extend({ defaultProps: { variant: 'filled' } }),
      /* 아래 넷은 채운 바탕 위의 아이콘과 숫자 색을 화면별 값으로 바꾼다 */
      Checkbox: Checkbox.extend({
        vars: (t, props) => ({ root: props.variant === 'outline' || props.iconColor ? {} : { '--checkbox-icon-color': onColorOf(t, props.color) } }),
      }),
      Radio: Radio.extend({
        vars: (t, props) => ({ root: props.variant === 'outline' || props.iconColor ? {} : { '--radio-icon-color': onColorOf(t, props.color) } }),
      }),
      Pagination: Pagination.extend({
        vars: (t, props) => ({ root: { '--pagination-active-color': onColorOf(t, props.color) } }),
      }),
      Stepper: Stepper.extend({
        vars: (t, props) => ({ root: { '--stepper-icon-color': onColorOf(t, props.color) } }),
      }),
      /* 탭 아래 선은 --tv-line */
      Tabs: Tabs.extend({ styles: { root: { '--tab-border-color': 'var(--tv-line)' } } }),
    },
  });
}

/* 3) 역할. 화면이 실제로 쓰는 이름이다. tokens.css 의 역할 구역과 같은 이름, 같은 값.
   --mantine-* 줄은 Mantine 부품이 쓰는 본문, 보조, 테두리 색을 우리 역할 값으로 맞추는 줄이다 */
export function buildCssVariablesResolver(picked: Picked = DEFAULT_PICKED): CSSVariablesResolver {
  const density = DENSITY[picked.density];
  const ink = picked.btn.startsWith('ink');
  const strongEdge = picked.edge === 'strong';

  /* 상태 칩 세 개의 색 배정(후보). site 는 지금 사이트, green 은 Open to join 과 In training 을 맞바꿈, mono 는 회색 계열 */
  const tone = (name: string) => ({ fg: `var(--tv-${name})`, bg: `var(--tv-${name}-bg)`, line: `var(--tv-${name}-line)` });
  const quiet = { fg: 'var(--tv-text-muted)', bg: 'var(--tv-bg-subtle)', line: 'var(--tv-line-strong)' };
  const chipTones = {
    site: { open: tone('info'), full: tone('warning'), training: tone('success') },
    green: { open: tone('success'), full: tone('warning'), training: tone('info') },
    mono: { open: { fg: 'var(--tv-text)', bg: 'var(--tv-line)', line: 'var(--tv-text-faint)' }, full: quiet, training: quiet },
  }[picked.chips];
  const chipVars = Object.fromEntries(
    Object.entries(chipTones).flatMap(([name, value]) => [
      [`--tv-chip-${name}`, value.fg],
      [`--tv-chip-${name}-bg`, value.bg],
      [`--tv-chip-${name}-line`, value.line],
    ]),
  );

  return (t) => {
    const c = t.colors;
    const mix = (color: string, percent: number) => `color-mix(in srgb, ${color} ${percent}%, ${c.dark[6]})`;
    /* 색마다 채운 바탕(밝은 화면 6번, 어두운 화면 4번) 위에 올릴 글자색을 고른다. 바탕이 밝으면 어두운 글자 */
    const onFilled = (shade: number) =>
      Object.fromEntries(Object.entries(c).map(([name, steps]) => [`--tv-on-${name}`, isLightColor(steps[shade], t.luminanceThreshold) ? c.dark[7] : t.white]));
    /* 버튼과 입력칸의 테두리. tokens 값(3번, 4번)은 바탕과의 대비가 1.5, 1.7 이라 기준 3 에 못 미친다.
       '또렷하게' 후보는 계단에서 기준을 넘는 가장 옅은 칸(밝은 화면 gray 6번, 어두운 화면 dark 3번)을 쓴다 */
    const lineStrong = { light: strongEdge ? c.gray[6] : c.gray[3], dark: strongEdge ? c.dark[3] : c.dark[4] };

    return {
      /* 밝기와 상관없는 값: 후보에 따라 바뀌는 간격, 글꼴, 버튼, 카드, 칩 */
      variables: {
        '--tv-pad-card': rem(density.pad),
        '--tv-gap': rem(density.gap),
        '--tv-gap-section': rem(density.section),
        '--tv-font-data': picked.type === 'c' ? FONT_MONO : FONT_SANS,
        '--tv-btn2-line': ink ? 'var(--tv-text)' : 'var(--tv-line-strong)',
        '--tv-btn2-shadow': ink ? 'inset 0 0 0 0.5px var(--tv-text)' : 'none',
        '--tv-card-line': picked.card === 'shadow' ? 'transparent' : 'var(--tv-line)',
        '--tv-card-shadow': picked.card === 'shadow' ? SHADOW_SM : 'none',
        '--tv-card-hover-shadow': picked.card === 'hover' ? SHADOW_HOVER : 'var(--tv-card-shadow)',
        '--tv-card-hover-shift': picked.card === 'hover' ? '-2px' : '0px',
        ...chipVars,
      },
      light: {
        ...onFilled(6),
        '--tv-bg': c.gray[0],
        '--tv-bg-subtle': c.gray[1],
        '--tv-surface': t.white,
        '--tv-line': c.gray[2],
        '--tv-line-strong': lineStrong.light,
        '--tv-text': c.gray[9],
        '--tv-text-muted': c.gray[7],
        '--tv-text-faint': c.gray[6],
        '--tv-success': c.green[6], '--tv-success-bg': c.green[0], '--tv-success-line': c.green[2],
        '--tv-warning': c.amber[8], '--tv-warning-bg': c.amber[0], '--tv-warning-line': c.amber[2],
        '--tv-danger': c.red[6], '--tv-danger-bg': c.red[0], '--tv-danger-line': c.red[2],
        '--tv-info': c.indigo[6], '--tv-info-bg': c.indigo[1], '--tv-info-line': c.indigo[2],
        '--tv-primary': c.indigo[6], '--tv-primary-hover': c.indigo[7], '--tv-on-primary': t.white,
        '--tv-link': c.indigo[6], '--tv-focus': c.indigo[5],
        '--tv-accent': c.indigo[6], '--tv-accent-bg': c.indigo[1], '--tv-accent-line': c.indigo[2],
        '--tv-domain-security': domainColors.security.light,
        '--tv-domain-finance': domainColors.finance.light,
        '--tv-domain-agriculture': domainColors.agriculture.light,
        '--tv-domain-healthcare': domainColors.healthcare.light,
        '--tv-domain-other': domainColors.other.light,

        '--mantine-color-body': c.gray[0],
        '--mantine-color-text': c.gray[9],
        '--mantine-color-dimmed': c.gray[7],
        '--mantine-color-placeholder': c.gray[6],
        '--mantine-color-default': t.white,
        '--mantine-color-default-hover': c.gray[1],
        '--mantine-color-default-color': c.gray[9],
        '--mantine-color-default-border': lineStrong.light,
        '--mantine-color-error': c.red[6],
        '--mantine-color-success': c.green[6],
      },
      dark: {
        ...onFilled(4),
        '--tv-bg': c.dark[7],
        '--tv-bg-subtle': '#101626',
        '--tv-surface': c.dark[6],
        '--tv-line': c.dark[5],
        '--tv-line-strong': lineStrong.dark,
        '--tv-text': c.dark[0],
        '--tv-text-muted': c.dark[2],
        '--tv-text-faint': c.dark[3],
        '--tv-success': c.green[4], '--tv-success-bg': mix(c.green[6], 22), '--tv-success-line': mix(c.green[5], 50),
        '--tv-warning': c.amber[4], '--tv-warning-bg': mix(c.amber[6], 20), '--tv-warning-line': mix(c.amber[5], 48),
        '--tv-danger': c.red[4], '--tv-danger-bg': mix(c.red[6], 22), '--tv-danger-line': mix(c.red[5], 50),
        '--tv-info': c.indigo[4], '--tv-info-bg': mix(c.indigo[6], 26), '--tv-info-line': mix(c.indigo[5], 55),
        '--tv-primary': c.indigo[4], '--tv-primary-hover': c.indigo[3], '--tv-on-primary': c.dark[7],
        '--tv-link': c.indigo[4], '--tv-focus': c.indigo[4],
        '--tv-accent': c.indigo[3], '--tv-accent-bg': mix(c.indigo[6], 26), '--tv-accent-line': mix(c.indigo[5], 55),
        '--tv-domain-security': domainColors.security.dark,
        '--tv-domain-finance': domainColors.finance.dark,
        '--tv-domain-agriculture': domainColors.agriculture.dark,
        '--tv-domain-healthcare': domainColors.healthcare.dark,
        '--tv-domain-other': domainColors.other.dark,

        '--mantine-color-body': c.dark[7],
        '--mantine-color-text': c.dark[0],
        '--mantine-color-dimmed': c.dark[2],
        '--mantine-color-placeholder': c.dark[3],
        '--mantine-color-default': c.dark[6],
        '--mantine-color-default-hover': c.dark[5],
        '--mantine-color-default-color': c.dark[0],
        '--mantine-color-default-border': lineStrong.dark,
        '--mantine-color-error': c.red[4],
        '--mantine-color-success': c.green[4],
        /* 어두운 화면에서 주 버튼에 마우스를 올리면 더 밝은 3번이 된다(Mantine 기본은 더 어두운 5번) */
        '--mantine-color-indigo-filled-hover': c.indigo[3],
        '--mantine-primary-color-filled-hover': c.indigo[3],
      },
    };
  };
}

/* 임시 기본값으로 만든 테마. 후보를 바꿔 볼 일이 없는 화면은 이것을 그대로 쓴다 */
export const theme = buildTheme();
export const cssVariablesResolver = buildCssVariablesResolver();
