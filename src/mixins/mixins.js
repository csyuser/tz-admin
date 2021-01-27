export const mixins = {
  data() {
    return {
      page: 1,
      pageSize: 10,
      tableDatas: {},
      dialogTitle: '',
      dialogType: '',
      checkedId: '',
      deleteIds: [],
      editDialogVisible: false,
      editDialogDisabled: false,
      deleteDialogVisible: false,
      selectedRow: [],
      editFormInfo: {},
      searchData: {},
      defaultProps: {
        children: 'children',
        label: 'name',
        value: 'id',
      },
      treeData: [],
      departmentClassifyDrop: [],
      departmentLevelDrop: [],
      rankDrop: [],
      postDrop: [],
      permissionTypeDrop: [],
      permissionScopeDrop: [],
      permissionRelateDrop: [],
      relatedTitle: '',
      relatedDialogVisible: false,
      transformData: [],
      relatedValue: [],
      relatedName: '',
      filterMethod(query, item) {
        return item.label.indexOf(query) > -1
      },
      rules: {
        name: [{required: true, message: '名称不能为空', trigger: 'blur'}],
        code: [{required: true, message: '编码不能为空', trigger: 'change'}],
        departmentId: [{required: true, message: '部门名称不能为空', trigger: 'change'}],
        sort: [{pattern: /^\d*$/, required: false, message: '排序必须为数字值'}],
        password: [{required: true, message: '密码不能为空', trigger: 'blur'}],
        status: [{required: true, message: '状态不能为空', trigger: 'change'}],
        post: [{required: true, message: '职务不能为空', trigger: 'change'}],
        rank: [{required: true, message: '职级不能为空', trigger: 'change'}],
        sex: [{required: true, message: '性别不能为空', trigger: 'change'}],
        phone: [{required: true, message: '电话不能为空', trigger: 'blur'},
          {pattern: /^\d{3}-\d{8}$|^\d{11}$/, message: '请输入正确的电话', trigger: 'blur'}
        ],
        email: [{type: 'email', required: true, message: '邮箱格式不正确', trigger: 'blur'}],
        idCard: [{required: true, message: '身份证号不能为空', trigger: 'blur'},
          {min: 18, max: 18, message: '请输入正确的身份证号', trigger: 'blur'}],
        entryTime: [{required: true, message: '入职时间不能为空', trigger: 'change'}],
        url: [{required: true, message: '菜单地址不能为空', trigger: 'blur'}],
        classId: [{required: true, message: '部门分类不能为空', trigger: 'change'}],
        level2: [{required: true, message: '部门级别不能为空', trigger: 'change'}],
        selection: [{required: true, message: '选用标志不能为空', trigger: 'change'}],
        type: [{required: true, message: '类型不能为空', trigger: 'change'}],
        menuId: [{required: true, message: '依赖菜单不能为空', trigger: 'change'}],
        isNeededScope: [{required: true, message: '是否需要范围必须', trigger: 'change'}],
        userType: [{required: true, message: '角色类型不能为空', trigger: 'change'}],
      }
    }
  },
  methods: {
    getDepartmentTree(treeUrl) {
      this.axios.get(treeUrl)
        .then(res => {
          if (res.data.code.toString() === '200') {
            this.treeData = res.data.data
          } else {this.treeData = []}
        })
        .catch()
    },
    getPages(url, formInline) {
      this.axios.get(url, {
        params: {
          page: this.page,
          pageSize: this.pageSize,
          ...formInline
        },
      }).then(res => {
        if (res.data.code.toString() === '200') {
          this.tableDatas = res.data
          this.selectedRow = []
        }
      })
        .catch()
    },
    currentPageChange(val, row, url) {
      this.page = val
      this.selectedRow = row
      this.deleteIds = []
      this.getPages(url)
    },
//表格增删改查
    selectedRows(val) {
      this.selectedRow = []
      val.forEach(item => {
        this.selectedRow.push(item)
      })
    },
    searchRow(pageUrl) {
      this.getPages(pageUrl, this.searchData)
    },
    addRow() {
      this.dialogType = 'add'
      this.editFormInfo = {isNeededScope: '0'}
      this.staffInfo = {}
      this.editDialogDisabled = false
      this.editDialogVisible = true
      console.log(this.editFormInfo)
    },
    updateRow() {
      this.dialogType = 'update'
      this.editDialogDisabled = false
      let info = this.getUpdateMessage()
      this.editFormInfo = info
      this.editFormInfo.sort = info.sort && parseInt(info.sort)
      this.imgId = info['photoId']
    },
    updateRow2(paramName, url) {
      this.dialogType = 'update'
      this.editDialogDisabled = false
      this.checkedId = this.getRowId()
      let obj = {}
      obj[paramName] = this.checkedId
      this.getDialogInfo({...obj}, url)
    },
    confirmEditRow(saveUrl, pageUrl) {
      this.$refs.editDialog.validate((valid) => {
        if (valid) {
          this.editDialogVisible = false
          let editData = {}
          if (this.dialogType === 'add') {
            editData = {...this.editFormInfo, photoId: this.imgId}
          } else if (this.dialogType === 'update') {
            editData = {id: this.selectedRow.id, ...this.editFormInfo, photoId: this.imgId}
          }
          if (this.dialogType !== 'view') {
            if (this.prePwd !== editData.password) {
              this.$confirm('确定要覆盖之前的密码?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.saveUser(saveUrl, pageUrl, editData)
              }).catch()
            } else {
              this.saveUser(saveUrl, pageUrl, editData)
            }
          }
        } else {
          return false
        }
      })
    },
    saveUser(saveUrl, pageUrl, editData) {
        this.axios.post(saveUrl, {...editData})
          .then(res => {
            if (res.data.code.toString() === '200') {
              this.$message.success('保存成功')
              this.getPages(pageUrl)
            }
          })
          .catch()
    },
    viewRow(row, cardId) {
      let info
      if (this.isCard) {
        this.tableDatas.data.forEach(item => {
          if (item.id === cardId) {info = item}
        })
      } else {info = row}
      this.dialogType = 'view'
      this.editFormInfo = info
      this.editFormInfo.sort = info.sort && parseInt(row.sort)
      this.editDialogVisible = true
      this.editDialogDisabled = true
    },
    viewRow2(row,paramName,url) {
      this.dialogType = 'view'
      this.editDialogVisible = true
      this.editDialogDisabled = true
      let id = this.isCard?this.cardCheckList[0]:row.id
      let obj = {}
      obj[paramName] = id
      this.getDialogInfo({...obj},url)
    },
    deleteRow() {
      this.deleteIds = this.getDeleteIds()
    },
    confirmDeleteRow(deleteUrl, pageUrl) {
      this.deleteDialogVisible = false
      this.axios.post(deleteUrl, {ids: this.deleteIds})
        .then(res => {
          if (res.data.code.toString() === '200') {
            this.$message.success('删除成功')
            this.getPages(pageUrl)
          } else {this.$message.error(this.data.msg)}
        })
        .catch(error => {this.$message.error('删除失败' + error)})
    },
//获取行或者卡片数据
    getUpdateMessage() {
      let info = {}
      if (this.isCard && this.cardCheckList.length === 1) {
        let cardId = this.cardCheckList[0]
        this.tableDatas.data.forEach(item => {
          if (item.id === cardId) info = item
        })
        this.editDialogVisible = true
      } else if (!this.isCard && this.selectedRow.length === 1) {
        info = this.selectedRow[0]
        this.editDialogVisible = true
      } else {this.$message.error('请选择一行数据')}
      return info
    },
    getDeleteIds() {
      let Ids = []
      if (this.isCard && this.cardCheckList.length >= 1) {
        Ids = this.cardCheckList
        this.deleteDialogVisible = true
      } else if (!this.isCard && this.selectedRow.length >= 1) {
        this.deleteDialogVisible = true
        this.selectedRow.forEach(row => {
          Ids.push(row.id)
        })
      } else {this.$message.error('请选择至少一行数据')}
      return Ids
    },
//下拉框 1部门分类，2部门级别，3职级，4权限类型，5权限范围类型，6权限关联类型，7职务
    getDropList(key) {
      this.axios.get('/dropList/getDropListByKey', {
        params: {dropListKey: key}
      }).then(res => {
        if (res.data.code.toString() === '200') {
          if (key === '1') {this.departmentClassifyDrop = res.data.data} else if (key === '2') {this.departmentLevelDrop = res.data.data} else if (key === '3') {this.rankDrop = res.data.data} else if (key === '4') {this.permissionTypeDrop = res.data.data} else if (key === '5') {this.permissionScopeDrop = res.data.data} else if (key === '6') {this.permissionRelateDrop = res.data.data} else if (key === '7') {this.postDrop = res.data.data}
        }
      })
        .catch()
    },
//获取弹窗的信息
    getDialogInfo(params, url) {
      this.editFormInfo = {}
      this.staffInfo = {}
      this.permissionList = []
      this.axios.get(url, {
        params: {...params}
      }).then(res => {
        if (res.data.code.toString() === '200') {
          this.editFormInfo = res.data.data
          this.staffInfo = res.data.data['person']
          this.permissionList = res.data.data['permissionList']
          this.prePwd = res.data.data.password
        }
      })
        .catch()
    },
//获取选择行id
    getRowId() {
      let id
      if (this.isCard && this.cardCheckList.length === 1) {
        id = this.cardCheckList[0]
        this.editDialogVisible = true
      } else if (!this.isCard && this.selectedRow.length === 1) {
        this.editDialogVisible = true
        id = this.selectedRow[0].id
      } else {this.$message.error('请选择一行数据')}
      return id
    },
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
    confirmRelate(saveUrl, params, dialogInfoParams, dialogInfoUrl) {
      this.relatedDialogVisible = false
      this.axios.post(saveUrl, {
        ...params
      }).then(res => {
        if (res.data.code.toString() === '200') {
          this.$message.success('保存成功')
          this.getDialogInfo(dialogInfoParams, dialogInfoUrl)
        }
      })
        .catch()
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(() => {
          done()
        })
        .catch(() => {})
    },
    closedDialog() {
      this.$refs['editDialog'].resetFields()
    }
  },
}