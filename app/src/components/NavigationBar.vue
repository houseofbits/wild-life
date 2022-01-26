<script setup lang="ts">

const props = defineProps({
  languages: {
    type: Array,
    default: null
  },

});

const emit = defineEmits(['selectLanguage']);

function selectLanguage(language: string): void {
  emit('selectLanguage', language);
}

</script>
<template>
  <div class="navigation-bar">
    <img src="@images/logo.svg" alt="" width="64">
    <div class="header-title">
      <slot/>
    </div>
    <slot name="links"/>
    <div v-if="languages" class="languages flex">
      <img v-for="language in languages" :src="'/images/flag-' + language + '.svg'" :alt="language"
           @click="selectLanguage(language)">
    </div>
  </div>
</template>