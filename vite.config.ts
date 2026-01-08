import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'

export default defineConfig({
    plugins: [
        react({
            jsxRuntime: 'automatic',
            jsxImportSource: 'react'
        }),
        dts({
            include: ['src/**/*'],
            exclude: ['src/main.tsx'],
            rollupTypes: true
        })
    ],
    build: {
        lib: {
            entry: 'src/index.ts',
            formats: ['es', 'cjs'],
            name: 'roks-rjsc',
            fileName: (format) => {
                if (format === 'es') return 'index.esm.js'
                return 'index.cjs.js'
            }
        },
        rollupOptions: {
            external: ['react', 'react-dom', 'react/jsx-runtime'],
            output: {
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM',
                    'react/jsx-runtime': 'react/jsx-runtime'
                }
            }
        }
    }
})