<template>
  <el-form label-width="80px" v-if="selected">
    <el-form-item label="名称">
      <el-input v-model="form.name" @change="update" />
    </el-form-item>
    <el-form-item label="类型">
      <el-input v-model="form.type" @change="update" />
    </el-form-item>
    <el-form-item label="说明">
      <el-input type="textarea" v-model="form.documentation" @change="update" />
    </el-form-item>
  </el-form>
  <div v-else class="text-gray-500">未选择结构</div>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { useModelStore } from '@/store/model'

const model = useModelStore()
const selected = computed(() => model.selected)

const form = reactive({
  name: '',
  type: '',
  documentation: ''
})

watch(
    selected,
    (val) => {
      if (val) {
        form.name = val.name
        form.type = val.type
        form.documentation = val.documentation || ''
      }
    },
    { immediate: true }
)

const update = () => {
  if (selected.value) {
    model.updateElement(selected.value.id, {
      name: form.name,
      type: form.type,
      documentation: form.documentation
    })
  }
}
</script>

<style scoped>
.text-gray-500 {
  padding: 12px;
}
</style>
