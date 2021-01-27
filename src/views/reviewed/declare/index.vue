<template>
  <div class="app-container">
    <avue-crud
      v-model="form"
      :data="data"
      :option="option"
      :table-loading="tableLoading"
      :page.sync="page"
      @row-update="rowUpdate"
      @current-change="currentChange"
      @refresh-change="refreshChange"
      @search-change="searchChange"
    >
    </avue-crud>
  </div>
</template>

<script>
import { Dic } from "@utils";
import { Page } from "@minxin";

export default {
  components: {},
  mixins: [Page],
  data() {
    return {
      form: {},
      search: {},
      tableLoading: false,
      data: [],
      option: {
        align: "center",
        menuAlign: "center",
        labelWidth: "125",
        viewBtn: true,
        addBtn: false,
        delBtn: false,
        editBtnText: "审核",
        span: 24,
        dialogWidth: "500",
        dialogClickModal: false,
        column: [
          {
            label: "用户",
            prop: "userName",
            editDisabled: true
          },
          {
            label: "业务",
            prop: "businessName",
            type: "select",
            dicData: Dic.find("DIC013"),
            editDisabled: true
          },
          {
            label: "国家",
            prop: "country",
            type: "select",
            dicData: Dic.find("DIC006"),
            editDisabled: true
          },
          {
            label: "周期",
            prop: "cycle",
            type: "select",
            dicData: Dic.find("DIC014"),
            editDisabled: true
          },
          {
            label: "时间",
            prop: "time",
            editDisabled: true
          },
          {
            label: "单位",
            prop: "unit",
            type: "select",
            dicData: Dic.find("DIC016"),
            editDisabled: true
          },
          {
            label: "数量",
            prop: "number",
            editDisabled: true
          },
          {
            label: "审核状态",
            prop: "status",
            type: "select",
            dicData: Dic.find("DIC009"),
            addDisplay: false,
            editDisplay: false
          },
          {
            label: "管理员审核状态",
            prop: "adminStatus",
            type: "radio",
            hide: true,
            dicData: [{
              label: "通过",
              value: "3"
            }, {
              label: "驳回",
              value: "2"
            }],
            editDisabled: true,
            editDisplay: false
          },
          {
            label: "管理员驳回原因",
            prop: "adminReasonsRejection",
            hide: true,
            editDisabled: true,
            editDisplay: false
          },
          {
            label: "审核状态",
            prop: "statusArr",
            type: "radio",
            dicData: [],
            hide: true,
            rules: [{
              required: true,
              message: "选择审核状态"
            }]
          },
          {
            label: "驳回原因",
            prop: "reasonsRejection",
            type: "textarea",
            hide: true,
            editDisplay: false,
            rules: []
          }
        ],
      },
    };
  },
  watch: {
    "form.status": {
      handler(val) {
        const statusArr = this.findObject(this.option.column, 'statusArr');
        const adminStatus = this.findObject(this.option.column, 'adminStatus');

        if (val === '1') {
          statusArr.dicData = [{
            label: "通过",
            value: "3"
          }, {
            label: "驳回",
            value: "2"
          }]
        }
        if (["2", "3"].includes(val)) {
          statusArr.dicData = [{
            label: "通过",
            value: "5"
          }, {
            label: "驳回",
            value: "4"
          }]
          adminStatus.editDisplay = true;
        }
      },
      immediate: true
    },
    "form.statusArr": {
      handler (val) {
        const reasonsRejection = this.findObject(this.option.column, 'reasonsRejection');
        if (["2", "4"].includes(val)) {
          reasonsRejection.editDisplay = true;
          reasonsRejection.rules = [{
            required: true,
            message: "输入驳回原因"
          }];
        } else {
          reasonsRejection.editDisplay = false;
          reasonsRejection.rules = [];
        }
        console.log(val);
      },
      immediate: true
    },
    "form.adminStatus": {
      handler(val) {
        const adminReasonsRejection = this.findObject(this.option.column, 'adminReasonsRejection');
        if (val === '2') {
          adminReasonsRejection.editDisplay = true;
        } else {
          adminReasonsRejection.editDisplay = false
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.getList();
  },
  methods: {
    // 列表
    async getList(cb = () => {}) {
      this.tableLoading = true;
      const result = await this.$fetchGet("/admin/declare/index", {
        ...this.search,
        pageNo: this.page.currentPage,
        pageSize: this.page.pageSize,
      });
      this.tableLoading = false;
      this.data = result
        ? result.rows.map((item) => {
            const {
              status: adminStatus,
              reasonsRejection: adminReasonsRejection,
              user: { name: userName },
              business: { business: businessName, country, declareClass },
            } = item;
            return {
              adminStatus,
              adminReasonsRejection,
              userName,
              businessName,
              country,
              declareClass,
              ...item,
            };
          })
        : [];
      this.page.total = result ? result.count : 0;
      cb();
    },
    // 分页
    currentChange() {
      this.getList();
    },
    // 搜索
    async searchChange(params, done) {
      this.search = params;
      this.page.currentPage = 1;
      this.getList(done);
    },
    // 重置
    refreshChange() {
      this.page.currentPage = 1;
      this.getList();
    },
    // 审核
    async rowUpdate (row, index, done, loading) {
      const { id, statusArr, reasonsRejection } = row;
      const result = await this.$fetchPost(
        "/admin/declare/edit",
        {
          id,
          status: statusArr,
          reasonsRejection : statusArr === '5' ? null :reasonsRejection
        },
        {
          allData: true,
        }
      );
      loading();
      if (!result.success) return;
      this.$message.success("审核成功");
      done();
      this.getList();
    }
  },
};
</script>

<style>
</style>