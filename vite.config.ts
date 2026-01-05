import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'

export default defineConfig({
    plugins: [
        react(),
        dts({
            include: ['src/**/*'],
            exclude: ['src/main.tsx'],
            rollupTypes: true
        })
    ],
    build: {
        lib: {
            entry: 'src/index.ts',
            name: 'roks-rjsc',
            fileName: (format) => `index.${format}.js`
        },
        rollupOptions: {
            external: ['react', 'react-dom'],
            output: {
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM'
                }
            }
        }
    }
})