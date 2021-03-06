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
      editFormInfo: {
        type: [],
      },
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
        return item.label && item.label.indexOf(query) > -1
      },
      buttonList: [],
      dialogButtonMap: {},
      tabId: '',
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
        userType: [{required: true, message: '角色类型不能为空', trigger: 'change'}],
        xzqhszDm: [{pattern: /^\d*$/, required: true, message: '数字必须为数字值'}],
        xzqhjc: [{required: true, message: '不能为空', trigger: 'change'}],
        xzqhlxDm: [{required: true, message: '不能为空', trigger: 'change'}],
        xzqhmc: [{required: true, message: '不能为空', trigger: 'blur'}],
        xybz: [{required: true, message: '选用标志必须', trigger: 'change'}],
        sjxzqhszDm: [{required: true, message: '上级行政区划数字代码不能为空', trigger: 'change'}],
        roleType: [{required: true, message: '岗位类型必须', trigger: 'change'}],
      }
    }
  },
  mounted() {
    if (this.$options.name!=='Permission'){this.getButtonList()}
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
    getPages(url) {
      this.tableDatas = {}
      this.axios.get(url, {
        params: {
          page: this.page,
          pageSize: this.pageSize,
          menuId: this.$route.query.name,
          ...this.searchData,
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
//获取页面buttonList
    getButtonList() {
      this.axios.get('/menu/selectButtonByMenuId', {
        params: {
          menuId: this.$route.query.name,
          tabId: this.tabId
        }
      })
        .then(res => {
          if (res.data.code.toString() === '200') {
            this.buttonList = res.data.data.buttonList
            this.dialogButtonMap = res.data.data.dialogButtonMap
          }
        })
        .catch()
    },
//是否显示弹窗按钮
    showDialogBtn(title){
     return  !!this.dialogButtonMap[title]
    },
//表格增删改查
    selectedRows(val) {
      this.selectedRow = []
      val.forEach(item => {
        this.selectedRow.push(item)
      })
    },
    searchRow(pageUrl) {
      this.getPages(pageUrl)
    },
    addRow() {
      this.dialogType = 'add'
      // this.editFormInfo = {type: []}
      this.isShowCascader = true
      this.editFormInfo = {}
      this.staffInfo = {}
      this.editDialogDisabled = false
      this.editDialogVisible = true
    },
    updateRow() {
      this.editFormInfo = {}
      this.dialogType = 'update'
      this.editDialogDisabled = false
      let info = this.getUpdateMessage()
      this.editFormInfo = JSON.parse(JSON.stringify(info))
      this.editFormInfo.sort = info.sort && parseInt(info.sort)
      this.imgId = info['photoId']
    },
    updateRow2(paramName, url) {
      this.editFormInfo = {}
      this.dialogType = 'update'
      this.editDialogDisabled = false
      this.isShowCascader = true
      this.checkedId = this.getRowId()
      if (this.checkedId === '' || !this.checkedId) return
      let obj = {}
      obj[paramName] = this.checkedId
      this.getDialogInfo({...obj}, url)
    },
    confirmEditRow(saveUrl, pageUrl) {
      this.$refs.editDialog.validate((valid) => {
        if (valid) {
          this.editDialogVisible = false
          // this.editFormInfo.permissionIds = this.permissionIds
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
      // let xxx = {...editData}
      // console.log(xxx)
      this.axios.post(saveUrl, {...editData})
        .then(res => {
          if (res.data.code.toString() === '200') {
            this.$message.success('保存成功')
            if (pageUrl) {
              this.getPages(pageUrl)
            }
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
      this.editFormInfo = JSON.parse(JSON.stringify(info))
      this.editFormInfo.sort = info.sort && parseInt(row.sort)
      this.editDialogVisible = true
      this.editDialogDisabled = true
    },
    viewRow2(row, paramName, url) {
      this.dialogType = 'view'
      this.editDialogVisible = true
      this.editDialogDisabled = true
      this.isShowCascader = true
      let id
      if (this.isCard) {
        id = this.cardCheckList[0]
      } else if (row.parentId) {
        id = row.parentId
      } else {
        id = row.id
      }
      let obj = {}
      obj[paramName] = id
      this.getDialogInfo({...obj}, url)
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
          this.permissionIds = res.data.data.permissionIds
          if (this.editFormInfo.sjxzqhszDm) {
            this.test_options = [{value: this.editFormInfo.sjxzqhszDm, label: this.editFormInfo.ssxzqmc, leaf: true}]
          }
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
          // this.getDialogInfo(dialogInfoParams, dialogInfoUrl)
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
      this.isShowCascader = false
      this.test_options = []
    },
  },
}