import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    preprocess: vitePreprocess(),
    package: {
        files: (filepath) => {
            if (filepath.includes("test/")) return false;
            return true;
        },
    },
    kit: {
        adapter: adapter()
    }
};

export default config;
