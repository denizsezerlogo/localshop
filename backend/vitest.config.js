import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    // Env değişkenleri test dosyaları app'i import etmeden ÖNCE ayarlanmalı
    setupFiles: ['./tests/setup-env.js'],
    // Tüm dosyalar aynı test veritabanını paylaşır → sırayla çalıştır
    fileParallelism: false,
    hookTimeout: 20000,
    testTimeout: 20000,
  },
});
