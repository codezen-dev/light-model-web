<template>
  <el-card class="full-height-card">
    <template #header>
      <div class="flex justify-between">
        <span>系统结构</span>
        <el-button size="small" type="primary" @click="dialogVisible = true">添加结构</el-button>
      </div>
    </template>

    <el-tree
        ref="treeRef"
        node-key="id"
        :data="treeData"
        :props="defaultProps"
        lazy
        highlight-current
        :load="loadNode"
        @node-click="onSelect"
        @node-contextmenu="onRightClick"
    />

    <el-divider />
    <ElementEditor v-if="model.selected" class="mt-4" />

    <el-dialog v-model="dialogVisible" title="添加结构" width="30%">
      <el-input v-model="newName" placeholder="请输入结构名称" />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmAdd">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useModelStore } from '@/store/model'
import ElementEditor from './ElementEditor.vue'
import type { Element } from '@/types/element'
import axios from 'axios'
import { ElMessageBox } from 'element-plus'

const model = useModelStore()
const treeData = ref<Element[]>([])
const dialogVisible = ref(false)
const newName = ref('')

const defaultProps = {
  children: 'children',
  label: 'name',
  isLeaf: 'isLeaf'
}

const loadNode = async (node: any, resolve: (children: Element[]) => void) => {
  if (node.level === 0) {
    const res = await axios.get('/api/elements/root')
    resolve(
        res.data.map((item: Element) => ({
          ...item,
          isLeaf: false
        }))
    )
  } else {
    const parentId = node.data.id
    const res = await axios.get(`/api/elements/children/${parentId}`)
    resolve(
        res.data.map((item: Element) => ({
          ...item,
          isLeaf: false
        }))
    )
  }
}

const confirmAdd = async () => {
  if (!newName.value) return
  const res = await axios.post('/api/elements', {
    name: newName.value,
    type: 'StructureDefinition'
  })
  treeData.value.push({ ...res.data, isLeaf: false })
  dialogVisible.value = false
  newName.value = ''
}

const onSelect = (node: Element) => {
  model.selectElement(node)
}

const onRightClick = (event: MouseEvent, node: Element) => {
  event.preventDefault()
  ElMessageBox.prompt('请输入子结构名称', '添加子结构', {
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  })
      .then(async ({ value }) => {
        const res = await axios.post('/api/elements', {
          name: value,
          type: 'PartUsage',
          owner: node.id
        })
        node.children = node.children || []
        node.children.push({ ...res.data, isLeaf: false })
      })
      .catch(() => {})
}
</script>
