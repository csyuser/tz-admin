<template>
    <svg class="icon">
      <use :xlink:href="`#${iconName}`"/>
    </svg>
</template>

<script>
//一次性引入所有的svg文件
const requireAll = requireContext => requireContext.keys().map(requireContext)
const req = require.context('../assets/icons', false, /\.svg$/)
requireAll(req)

export default {
  name: 'SvgIcon',
  props:{
    iconName:{
      type:String
    }
  },
  computed: {
  }
}
</script>

<style scoped lang='scss'>
.icon {
  font-size: 12px;
  height: 1em;
  width: 1em;
  vertical-align: -2px;
  vertical-align: center;
  fill: currentColor;
  overflow: hidden;
  margin-right: 1em;
}
</style>