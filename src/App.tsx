import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { useMemo } from 'react';
import { buildCssVariablesResolver, buildTheme, resolvePicked } from './framework/ui';
import { Catalog } from './travi/Catalog';
import { useMeeting } from './travi/meetingStore';

/* 앱의 뿌리. 테마를 한 번만 씌우고 그 안에 화면을 둔다. 밝은 화면이 기본이고 고른 밝기는 브라우저에 저장된다.
   회의에서 고른 후보 값이 바뀌면 테마를 다시 만든다. 고르지 않은 것은 임시 기본값으로 채운다 */
export default function App() {
  const choice = useMeeting((state) => state.choice);
  const picked = useMemo(() => resolvePicked(choice), [choice]);
  const theme = useMemo(() => buildTheme(picked), [picked]);
  const cssVariablesResolver = useMemo(() => buildCssVariablesResolver(picked), [picked]);

  return (
    <MantineProvider theme={theme} cssVariablesResolver={cssVariablesResolver} defaultColorScheme="light">
      <Catalog picked={picked} paletteConfirmed={choice.palette === 'ok'} />
    </MantineProvider>
  );
}
