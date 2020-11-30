<template>
    <el-form-item :label="labelName" class="treeItem">
      <el-input v-model="treeValue" suffix-icon="xxx" @focus="focus" @blur="blur"
                ref="treeInput"></el-input>
      <el-tree :data="data" :props="defaultProps" @node-click="select" class="tree" :class="{treeVisible}"
               @node-expand="treeNode" @node-collapse="treeNode"></el-tree>
    </el-form-item>
</template>

<script>
export default {
  name: 'SelectTree',
  props: {
    treeValue: {type: String},
    labelName: {type: String},
    data: {type: Array},
    defaultProps: {type: Object}
  },
  data() {
    return {
      treeVisible: false,
      isFocus: false,
    }
  },
  methods: {
//数据下拉框
    treeNode() {
      this.isFocus = true
      this.treeVisible = true
      this.$refs.treeInput.focus()
    },
    focus() {
      this.treeVisible = true
    },
    blur() {
      this.isFocus = false
      setTimeout(() => {
        if (this.isFocus !== true) {
          this.treeVisible = false
        }
      }, 100)
    },
    select(data) {
      console.log(data)
      this.treeVisible = false
      // this.staffInfo.name = data.label
      this.$emit('selectedTree',data)
    },
  }
}
</script>

<style scoped lang='scss'>
.treeItem {
  position: relative;

  .tree {
    display: none;
    position: absolute;
    border: 1px solid #DCDFE6;
    padding-right: 10px;
    width: 215px;
    border-radius: 4px;
    margin-top: 5px;
  }

  .treeVisible {
    display: block;
  }
}
</style>