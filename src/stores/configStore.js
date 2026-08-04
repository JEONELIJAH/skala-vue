import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useConfigStore = defineStore('config', () => {
    // state
    const unit = ref('celsius')

    // getters
    const unitSymbol = computed(() => {
        return unit.value === 'celsius' ? '℃' : '℉'
    })

    // actions
    function toggleUnit() {
        unit.value = unit.value === 'celsius' ? 'fahrenheit' : 'celsius'
    }

    return {
        unit,
        unitSymbol,
        toggleUnit,
    }
})