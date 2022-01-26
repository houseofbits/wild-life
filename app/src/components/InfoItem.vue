<script setup lang="ts">
import InfoDetailView from "@src/components/InfoDetailView.vue";
import DetailListItem from "@src/structures/DetailListItem";
import {watch, ref} from "vue";

const emit = defineEmits(['close']);
const props = defineProps({
  item: {
    type: DetailListItem,
    required: true
  },
  isSelected: {
    type: Boolean,
    default: false
  }
});

const isOpenOrLoading = ref(false);

function getImageTransform(item: DetailListItem): string {
  return props.isSelected
      ? item.detailImageTransform.getAsStyle()
      : item.thumbnailImageTransform.getAsStyle();
}

watch(() => props.isSelected, (isSelected: boolean) => {
  if (isSelected) {
    isOpenOrLoading.value = true;
  } else {
    setTimeout(() => isOpenOrLoading.value = false, 500);
  }
});

</script>
<template>
  <div
      class="item"
      :class="{active: props.isSelected, 'on-top': isOpenOrLoading}"
  >
    <div class="icon-background"/>
    <img
        class="main-image"
        :src="'/images/' + item.imageFileName"
        :style="getImageTransform(item)"
        alt=""
    />
    <div class="icon-content" :data-item-id="item.id">
      <h1>{{ item.title }}</h1>
      <em v-html="item.latinTitle"/>
      <span class="identifier">{{ item.identifier }}</span>
    </div>
    <info-detail-view v-if="isOpenOrLoading" :item="item" @close="emit('close')"/>
  </div>
</template>