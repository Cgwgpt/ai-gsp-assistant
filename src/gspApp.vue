<template>
  <div class="gsp-app">
    <!-- <header class="app-header">
      <div class="header-content">
        <h1 class="app-title">GSP检查常见缺陷汇总</h1>

      </div>
    </header> -->

    <main class="main-content">
      <div class="content-wrapper">
        <div class="search-container">
          <i class="search-icon">🔍</i>
          <input
            type="text"
            v-model="searchQuery"
            placeholder="搜索缺陷信息..."
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
                v-for="category in categories"
                :key="category.id"
                :class="['filter-btn', { active: selectedCategory === category.id }]"
                @click="selectedCategory = category.id"
              >
                {{ category.name }}
              </button>
            </div>
          </div>
        </div>

        <div class="defects-grid">
          <div 
            v-for="defect in filteredDefects" 
            :key="defect.id" 
            class="defect-card"
            :class="defect.level"
          >
            <div class="card-header">
              <span class="defect-level">{{ defect.levelName }}</span>
              <span class="defect-category">{{ getCategoryName(defect.category) }}</span>
            </div>
            <p class="defect-content">{{ defect.content }}</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { defects, categories, levels } from './data/defects.js'

export default {
  name: 'App',
  data() {
    return {
      searchQuery: '',
      selectedCategory: 'all',
      selectedLevel: 'all',
      categories,
      levels,
      defects
    }
  },
  computed: {
    filteredDefects() {
      return this.defects.filter(defect => {
        const matchesSearch = defect.content.toLowerCase().includes(this.searchQuery.toLowerCase())
        const matchesCategory = this.selectedCategory === 'all' || defect.category === this.selectedCategory
        const matchesLevel = this.selectedLevel === 'all' || defect.level === this.selectedLevel
        return matchesSearch && matchesCategory && matchesLevel
      })
    }
  },
  methods: {
    getCategoryName(categoryId) {
      const category = this.categories.find(c => c.id === categoryId)
      return category ? category.name : categoryId
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
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.check-items-link {
  color: var(--primary-color);
  text-decoration: none;
  padding: 0.5rem 1rem;
  border: 1px solid var(--primary-color);
  border-radius: 4px;
  transition: all 0.3s;
}

.check-items-link:hover {
  background-color: var(--primary-color);
  color: white;
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

.defects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.defect-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: var(--card-shadow);
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
}

.defect-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.defect-card.serious {
  border-top: 4px solid var(--serious-color);
}

.defect-card.major {
  border-top: 4px solid var(--major-color);
}

.defect-card.minor {
  border-top: 4px solid var(--minor-color);
}

.card-header {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.defect-level {
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  margin-right: 0.8rem;
}

.serious .defect-level {
  background: var(--serious-color);
  color: white;
}

.major .defect-level {
  background: var(--major-color);
  color: white;
}

.minor .defect-level {
  background: var(--minor-color);
  color: white;
}

.defect-category {
  color: #606266;
  font-size: 0.9rem;
}

.defect-content {
  margin: 0;
  line-height: 1.6;
  color: #303133;
  font-size: 0.95rem;
}

@media (max-width: 768px) {
  .header-content {
    padding: 1rem;
    flex-direction: column;
    gap: 1rem;
  }

  .check-items-link {
    display: inline-block;
    margin-top: 0.5rem;
  }

  .search-container {
    width: 100%;
    padding: 0 1rem;
    position: relative;
  }

  .content-wrapper {
    padding: 0 1rem;
  }

  .defects-grid {
    grid-template-columns: 1fr;
  }

  .app-title {
    padding-left: 0.5rem;
  }
}
</style> 