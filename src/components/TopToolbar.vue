<!-- src/components/TopToolbar.vue -->
<template>
  <div class="toolbar-container">
    <el-row type="flex" justify="space-between" class="toolbar">
      <div>
<!--        <el-button type="primary" @click="createElement">新增结构</el-button>-->
      </div>
      <div>
        <el-button @click="clearModel">清空建模</el-button>
        <el-button @click="saveModel">保存（待实现）</el-button>
        <el-button @click="exportDsl">导出 DSL</el-button>
      </div>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { useModelStore } from '@/store/model'

const modelStore = useModelStore()

function createElement() {
  modelStore.createElement('新结构', 'Block')
}

function clearModel() {
  modelStore.clear()
}

function saveModel() {
  console.log('保存功能待实现')
}

function exportDsl() {
  const dsl = modelStore.generateDsl()
  console.log('DSL 输出：\n', dsl)
  alert(dsl)
}
</script>

<style scoped>
.toolbar-container {
  padding: 10px 15px;
  border-bottom: 1px solid #dcdfe6;
  background-color: #f9f9f9;
}
</style>
