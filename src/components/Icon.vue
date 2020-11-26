<template>
  <svg class="icon" @click="$emit('navIconClicked',$event)">
    <use :xlink:href="`#icon-${iconName}`"/>
  </svg>
</template>

<script>
export default {
  name: 'Icon',
  data() {
    return {
      iconName:'group'
    }
  }
}
</script>

<style scoped lang='scss'>

</style>