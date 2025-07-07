// src/store/model.ts
import { defineStore } from 'pinia'
import type { Element } from '@/types/element'
import { fetchElements, createElement, updateElement, deleteElement } from '@/api/elements'

export const useModelStore = defineStore('model', {
    state: () => ({
        rootElements: [] as Element[],
        selected: null as Element | null
    }),

    actions: {
        async loadElements() {
            const res = await fetchElements()
            this.rootElements = res.data
        },

        async addRootElement(name: string, type = 'StructureDefinition') {
            const res = await createElement({ name, type })
            this.rootElements.push(res.data)
        },

        async addChildElement(parent: Element, name: string, type = 'PartUsage') {
            const res = await createElement({
                name,
                type,
                owner: parent.id
            })
            if (!parent.children) parent.children = []
            parent.children.push(res.data)
        },

        async updateElement(id: string, payload: Partial<Element>) {
            await updateElement(id, payload)
            const applyUpdate = (elements: Element[]) => {
                for (const el of elements) {
                    if (el.id === id) {
                        Object.assign(el, payload)
                        return
                    }
                    if (el.children) applyUpdate(el.children)
                }
            }
            applyUpdate(this.rootElements)
        },

        async deleteElementById(id: string) {
            await deleteElement(id)
            const removeRecursively = (elements: Element[]): Element[] =>
                elements.filter(el => {
                    if (el.id === id) return false
                    if (el.children) el.children = removeRecursively(el.children)
                    return true
                })
            this.rootElements = removeRecursively(this.rootElements)
        },

        selectElement(el: Element) {
            this.selected = el
        },

        clear() {
            this.rootElements = []
            this.selected = null
        },

        generateDsl(): string {
            const renderElement = (el: Element, indent = 0): string => {
                const pad = '  '.repeat(indent)
                let dsl = `${pad}${el.type} ${el.name}`
                if (el.documentation) dsl += ` // ${el.documentation}`
                dsl += '\n'
                if (el.children) {
                    for (const child of el.children) {
                        dsl += renderElement(child, indent + 1)
                    }
                }
                return dsl
            }
            return this.rootElements.map(el => renderElement(el)).join('')
        }
    }
})
