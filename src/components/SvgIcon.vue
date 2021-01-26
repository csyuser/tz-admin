<template>
    <svg class="icon" :style="{color: color,width:sizeNumber,height:sizeNumber,marginRight:size === 'medium'? 0 :'1em'}">
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
    },
    color:{type:String},
    size:{type:String}
  },
  computed: {
    sizeNumber(){
      let number
      switch (this.size){
        case 'medium':
          number = '1.5em';
          break;
        case 'small':
          number = '1em';
          break;
        default:
       break;
      }
      return number
    }
  }
}
</script>

<style scoped lang='scss'>
.icon {
  height: 1em;
  width: 1em;
  vertical-align: -2px;
  //vertical-align: center;
  fill: currentColor;
  overflow: hidden;
  margin-right: 1em;
}
</style>