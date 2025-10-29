<template>
  <div class="min-h-screen bg-white">
    <TheNavbar />
    <HeroSection />
    <DemoSection />
    <!-- <FeaturesSection /> -->
    <!-- 暂时注释掉这两个页面 -->
    <!-- <GspReportInterface /> -->
    <StatsSection />
    <TheFooter />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import TheNavbar from './components/TheNavbar.vue'
import HeroSection from './components/HeroSection.vue'
import DemoSection from './components/DemoSection.vue'
import FeaturesSection from './components/FeaturesSection.vue'
import GspReportInterface from './components/gsp/GspReportInterface.vue'
import StatsSection from './components/StatsSection.vue'
import TheFooter from './components/TheFooter.vue'
</script>