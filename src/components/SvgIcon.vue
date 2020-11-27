<template>
  <div class="xxx">
    icon
    <svg>
      <use xlink:href="#post"/>
    </svg>
  </div>

</template>

<script>
//一次性引入所有的svg文件
const requireAll = requireContext => requireContext.keys().map(requireContext)
const req = require.context('../assets/icons', false, /\.svg$/)
requireAll(req)

export default {
  name: 'SvgIcon',
  data(){
    return{
      iconName:'group'
    }
  },
  computed: {
  }
}
</script>

<style scoped lang='scss'>
.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>