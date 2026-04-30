import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        checkout: resolve(__dirname, 'checkout.html'),
        combo: resolve(__dirname, 'combo.html'),
        contact: resolve(__dirname, 'contact.html'),
        courseMedia: resolve(__dirname, 'course-media.html'),
        courseWork: resolve(__dirname, 'course-work.html'),
        courses: resolve(__dirname, 'courses.html'),
        faq: resolve(__dirname, 'faq.html'),
        login: resolve(__dirname, 'login.html'),
        register: resolve(__dirname, 'register.html'),
        success: resolve(__dirname, 'success.html')
      }
    }
  }
});
