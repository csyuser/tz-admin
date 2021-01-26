export const relateMixins = {
  data() {
    return {
      relatedTitle: '',
      relatedDialogVisible: false,
      transformData: [],
      relatedValue: [],
      relatedName: '',
      filterMethod(query, item) {
        return item.label.indexOf(query) > -1
      },
    }
  },
  methods: {
//关联功能
    related(treeUrl, title, params) {
      // if (this.selectedRow.length !== 1) {
      //   this.$message.error('请选择一行数据')
      //   return
      // }
      this.axios.get(treeUrl, {
        params: {...params}
      }).then(res => {
        if (res.data.code.toString() === '200') {
          this.transformData = res.data.data['allList']
          this.relatedValue = res.data.data['checkList']
        }
      })
        .catch()
      this.relatedTitle = title
      this.relatedDialogVisible = true
    },
    confirmRelate(saveUrl, params) {
      this.relatedDialogVisible = false
      this.axios.post(saveUrl, {
        ...params
      }).then(res => {
        if (res.data.code.toString() === '200') {
          this.$message.success('保存成功')
          this.$emit('update:dialogInfo')
        }
      })
        .catch()
    },
  },
}