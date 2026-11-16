import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// base './' : 빌드 결과를 어느 하위 주소에 올려도 자원 경로가 맞게 한다
export default defineConfig({
  base: './',
  plugins: [react()],
})
