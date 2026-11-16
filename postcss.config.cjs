// Mantine 이 CSS 안에서 쓰는 rem(), light-dark(), @mixin 을 풀어 주는 설정이다. Next 로 옮겨도 같은 내용을 쓴다.
module.exports = {
  plugins: {
    'postcss-preset-mantine': {},
    'postcss-simple-vars': {
      variables: {
        'mantine-breakpoint-xs': '36em',
        'mantine-breakpoint-sm': '48em',
        'mantine-breakpoint-md': '62em',
        'mantine-breakpoint-lg': '75em',
        'mantine-breakpoint-xl': '88em',
      },
    },
  },
};
