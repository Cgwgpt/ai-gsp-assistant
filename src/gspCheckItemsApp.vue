<template>
  <div class="gsp-app">
    <!-- <header class="app-header">
      <div class="header-content">
        <h1 class="app-title">零售企业检查项目共176项，其中严重缺陷项目（**）8项，主要缺陷项（*）53项，一般缺陷项115项</h1>
      </div>
    </header> -->

    <main class="main-content">
      <div class="content-wrapper">
        <div class="search-container">
          <i class="search-icon">🔍</i>
          <input
            type="text"
            v-model="searchQuery"
            placeholder="搜索检查项目..."
            class="search-input"
          />
        </div>

        <div class="filters">
          <div class="filter-group">
            <h3>按严重程度筛选</h3>
            <div class="filter-buttons">
              <button
                v-for="level in levels"
                :key="level.id"
                :class="['filter-btn', { active: selectedLevel === level.id }]"
                @click="selectedLevel = level.id"
              >
                {{ level.name }}
              </button>
            </div>
          </div>

          <div class="filter-group">
            <h3>按类别筛选</h3>
            <div class="filter-buttons">
              <button
                v-for="category in uniqueCategories"
                :key="category"
                :class="['filter-btn', { active: selectedCategory === category }]"
                @click="selectedCategory = category"
              >
                {{ category }}
              </button>
            </div>
          </div>
        </div>

        <div class="check-items-grid">
          <div 
            v-for="item in filteredItems" 
            :key="item.id" 
            class="check-item-card"
            :class="item.level"
          >
            <div class="card-header">
              <span class="item-level">{{ item.levelName }}</span>
              <span class="item-category">{{ item.category }}</span>
            </div>
            <div class="item-number">条款号：{{ item.clauseNumber }}</div>
            <p class="item-content">{{ item.checkItem }}</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { gspCheckItems } from './data/gspCheckItems.js'

export default {
  name: 'GspCheckItemsApp',
  data() {
    return {
      searchQuery: '',
      selectedCategory: 'all',
      selectedLevel: 'all',
      levels: [
        { id: 'all', name: '全部' },
        { id: 'serious', name: '严重缺陷' },
        { id: 'major', name: '主要缺陷' },
        { id: 'minor', name: '一般缺陷' }
      ],
      checkItems: gspCheckItems
    }
  },
  computed: {
    uniqueCategories() {
      const categories = ['all', ...new Set(this.checkItems.map(item => item.category))]
      return categories
    },
    filteredItems() {
      return this.checkItems.filter(item => {
        const matchesSearch = item.checkItem.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                            item.clauseNumber.toLowerCase().includes(this.searchQuery.toLowerCase())
        const matchesCategory = this.selectedCategory === 'all' || item.category === this.selectedCategory
        const matchesLevel = this.selectedLevel === 'all' || item.level === this.selectedLevel
        return matchesSearch && matchesCategory && matchesLevel
      })
    }
  }
}
</script>

<style>
.gsp-app {
  all: initial;
}

:root {
  --primary-color: #1976d2;
  --serious-color: #ff5252;
  --major-color: #ffa726;
  --minor-color: #66bb6a;
  --bg-color: #f5f7fa;
  --card-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  --header-height: 64px;
}

body {
  margin: 0;
  background-color: var(--bg-color);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  color: #2c3e50;
}

.app-header {
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0.8rem 2rem;
  text-align: left;
}

.app-title {
  font-size: 1.5rem;
  color: var(--primary-color);
  margin: 0;
  font-weight: 600;
  text-align: left;
  padding-left: 1rem;
}

.search-container {
  margin-bottom: 2rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  position: relative;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #909399;
  z-index: 1;
  font-style: normal;
}

.search-input {
  width: 100%;
  padding: 1rem 1rem 1rem 2.5rem;
  font-size: 1rem;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  transition: all 0.3s;
  background: white;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.main-content {
  margin-top: calc(var(--header-height) + 2rem);
  min-height: calc(100vh - var(--header-height));
}

.content-wrapper {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

.filters {
  margin-bottom: 2rem;
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: var(--card-shadow);
}

.filter-group {
  margin-bottom: 1.5rem;
}

.filter-group:last-child {
  margin-bottom: 0;
}

.filter-group h3 {
  margin: 0 0 1rem;
  color: #2c3e50;
  font-size: 1rem;
  font-weight: 600;
}

.filter-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
}

.filter-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.9rem;
}

.filter-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
  transform: translateY(-1px);
}

.filter-btn.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
  box-shadow: 0 2px 6px rgba(25, 118, 210, 0.2);
}

.check-items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.check-item-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: var(--card-shadow);
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
}

.check-item-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.check-item-card.serious {
  border-top: 4px solid var(--serious-color);
}

.check-item-card.major {
  border-top: 4px solid var(--major-color);
}

.check-item-card.minor {
  border-top: 4px solid var(--minor-color);
}

.card-header {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.item-level {
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  margin-right: 0.8rem;
}

.serious .item-level {
  background: var(--serious-color);
  color: white;
}

.major .item-level {
  background: var(--major-color);
  color: white;
}

.minor .item-level {
  background: var(--minor-color);
  color: white;
}

.item-category {
  color: #606266;
  font-size: 0.9rem;
}

.item-number {
  color: #909399;
  font-size: 0.85rem;
  margin-bottom: 0.5rem;
}

.item-content {
  margin: 0;
  line-height: 1.6;
  color: #303133;
  font-size: 0.95rem;
}

@media (max-width: 768px) {
  .header-content {
    padding: 1rem;
  }

  .search-container {
    width: 100%;
    padding: 0 1rem;
    position: relative;
  }

  .content-wrapper {
    padding: 0 1rem;
  }

  .check-items-grid {
    grid-template-columns: 1fr;
  }

  .app-title {
    padding-left: 0.5rem;
  }
}
</style> 