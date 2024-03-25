import { defineConfig } from 'astro/config';

import mdx from "@astrojs/mdx";
import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
    output: 'server',
    adapter: netlify({
        imageCDN: false,
    }),

    integrations: [mdx()]
});
