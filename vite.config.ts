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
            exclude: ['src/main.tsx', 'src/**/*.test.*', 'src/**/*.spec.*', 'src/**/__tests__/**'],
            rollupTypes: false
        })
    ],
    build: {
        lib: {
            entry: {
                index: 'src/index.ts',
                modal: 'src/modal.ts',
                loading: 'src/loading.ts'
            },
            formats: ['es', 'cjs'],
            name: 'roks-rjsc',
            fileName: (format, entryName) => {
                const ext = format === 'es' ? 'esm' : 'cjs'
                return `${entryName}.${ext}.js`
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