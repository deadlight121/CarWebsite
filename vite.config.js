import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
server: {
    proxy: {
      // Все запросы, начинающиеся с /api, будут проксироваться на carapi.app
      '/api': {
        target: 'https://carapi.app',
        changeOrigin: true,
        // Убираем префикс /api, если у тебя на сервере пути без него
        // например, /api/makes -> /api/makes (оставляем одинаково)
        // если бы нужно было /api/makes -> /makes, то добавили бы rewrite
        // rewrite: (path) => path.replace(/^\/api/, ''),
        secure: true,
      },
    },
  },
})
