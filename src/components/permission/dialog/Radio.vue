<template>
  <el-radio-group v-model="radioValue">
    <el-radio :label="item.label" @click.native.prevent="onRadioChange(item.label)" v-for="item in radioList" :key="item.label">{{ item.name }}</el-radio>
  </el-radio-group>
</template>

<script>
export default {
  name: 'Radio',
  model:{
    prop: 'value',
    event: 'selected',
  },
  props:{
    value:{type:String},
    radioList:{type:Array}
  },
  watch:{
    value:{
      handler(val){
        this.radioValue = val
      },
      immediate:true
    },
  },
  data() {
    return {
      radioValue:''
    }
  },
  methods:{
    onRadioChange(e) {
      if (e === this.radioValue){
        this.radioValue = ''
        // this.$set(this.editFormInfo,'riskLevel','')
      }else {
        this.radioValue = e
        // this.$set(this.editFormInfo,'riskLevel',e)
      }
      this.$emit('selected',this.radioValue)
    },
  }
}
</script>

<style scoped lang='scss'>

</style>